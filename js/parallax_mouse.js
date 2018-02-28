/*
    DOCUMENTATION:
    Pour implémenter un effet de parallax sur un element du DOM, il suffit de le placer dans un élément possédant l'attribut parallax-container, et du lui donner l'element parallax-element ainsi que des options (possédant toutes une valeur par défaut). La liste des options est la suivante :

    data-event-type (défaut : mouseX): Détermine quel évènement provoque le déplacement de l'élément. Valeur possibles :
            _mouseX : réagit au mouvement horizontal de la souris
            _mouseY : réagit au mouvement vartical de la souris
            _scroll : réagit au scroll de la page

    data-transform-type (défaut : translate): détermine la transformation qui sera appliquée à l'element. Valeurs possibles :
            _translate : translation
            _rotation : rotation
    data-coef (défaut: 1): détermine le coefficient de l'effet parallax. Plus il est petit, moins l'effet sera important. Valeur préférable entre 0 et 1
    direction (défaut : right): détermine la direction de l'effet. Valeurs possibles:
            _right (translation et rotation)
            _left (translation et rotation)
            _top (translation uniquement)
            _bottom (translation uniquement)
    x-position(défaut: 0) : détermine la position par défaut de l'element (en pourcentage)
    y-position(défaut: 0) : détermine la position par défaut de l'element (en pourcentage)

    EXEMPLES :

    1 - parallax translation de gauche à droite au movement horizontal de la souris : si l'on utilise la valeur par défaut, pas la peine de préciser l'option
    <div parallax-container>
        <div parallax-element
             data-coef="0.5">
    <div parallax-container>

    2 - parallax de bas en haut au mouvemnt vertical de la souris
    <div parallax-container>
        <div parallax-element
             data-event-type="mouseY"
             data-coef="0.8"
             data-direction="top"
             data-y-position="100"
             >
    <div parallax-container>

    3 - rotation dans le sens inverse des aiguilles d'une montre au mouvement vertical de la souris
    <div parallax-container>
        <div parallax-element
             data-event-type="mouseY"
             data-transform-type="rotate"
             data-coef="0.65"
             data-direction="left"
             >
    <div parallax-container>
*/


document.addEventListener('DOMContentLoaded', () => {
    let parallax = new Parallax();

    parallax.init();
});


class Parallax{
    constructor(){
        this.containers;
        this.elements = [];
    }

    init(){
        this.containers = document.querySelectorAll("[parallax-container]");

        let elements = document.querySelectorAll("[parallax-element]");
        this.parseElementsOptions(elements);

        this.setContainersCSS();

        this.setElementsCSS();

        this.setListeners();
    }

    parseElementsOptions(elements){
        let elementsArray = Array.from(elements)
        this.elements = elementsArray.map( el => {
            return {
                DOMElement : el,
                options : {
                    eventType : el.dataset.eventType || "mouseX",
                    transformType : el.dataset.transformType || "translate",
                    coef : el.dataset.coef || 1,
                    direction : el.dataset.direction || "right",
                    xPosition : el.dataset.xPosition || 0,
                    yPosition : el.dataset.yPosition || 0
                }
            }
        })
    }

    setContainersCSS(){
        this.containers.forEach(function(container){
            let position = window.getComputedStyle(container, null).position;
            if (position != "absolute"){
              container.style.position = "relative";
            }
            container.style.perspective = "700px"
        });
    }

    setElementsCSS(){
        this.elements.forEach(function(element){
            let el = element.DOMElement,
                opts = element.options;

            el.style.width = "100%";
            el.style.height = "100%";
            el.style.position = "absolute";
            el.style.top = opts.yPosition + "%";
            el.style.left = opts.xPosition + "%";
        })
    }

    setListeners(){
        document.body.addEventListener('mousemove', e => this.mouseParallax(e));
        document.body.addEventListener('scroll', this.scrollParallax);
    }

    mouseParallax(e){
        let mouseX      = e.clientX,
            mouseY      = e.clientY,
            screenWidth = window.innerWidth,
            screenHeight = window.innerHeight,
            xPercentage = mouseX / screenWidth * 100,
            yPercentage = mouseY / screenHeight * 100,
            mouseElements = this.elements.filter( el =>el.options.eventType === "mouseX" || el.options.eventType === "mouseY");

        mouseElements.forEach(element =>{
            let el      = element.DOMElement,
                opts    = element.options;
            if (opts.transformType == "translate"){
                this.applyTranslation(el, opts, xPercentage, yPercentage);
            } else if (opts.transformType == "rotate") {
                this.applyRotation(el, opts, xPercentage, yPercentage);
            }
        })
    }

    scrollParallax(e){

    }

    applyTranslation(el, opts, xPercentage, yPercentage){
        let translatePercentage;
        if (opts.eventType === "mouseX"){
            translatePercentage = (xPercentage) * opts.coef;
        } else {
            translatePercentage = (yPercentage) * opts.coef;
        }

        switch(opts.direction){
            case "right":
                el.style.transform = `translatex(${translatePercentage}%)`;
                break;
            case "left":
                el.style.transform = `translatex(-${translatePercentage}%)`;
                break;
            case "bottom":
                el.style.transform = `translatey(${translatePercentage}%)`;
                break;
            case "top":
                el.style.transform = `translatey(-${translatePercentage}%)`;
                break;
        }
    }

    applyRotation(el, opts, xPercentage, yPercentage){
        let rotateAngle;
        if (opts.eventType === "mouseX"){
            rotateAngle = Math.round((xPercentage-180) / 100 * 360 * opts.coef);
        } else {
            rotateAngle = Math.round((yPercentage-180) / 100 * 360 * opts.coef);
        }
        switch (opts.direction) {
            case "right":
                el.style.transform = `rotateZ(${rotateAngle}DEG)`;
                break;
            case "left":
                el.style.transform = `rotateZ(${-rotateAngle}DEG)`;
                console.log(el.style.transform);
                break;
        }
    }
}
