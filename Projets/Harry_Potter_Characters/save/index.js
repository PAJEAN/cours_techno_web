/**
 * Liste des ingrédients.
 * Prendre un ingrédients pour le mettre dans une marmitte.
 * Grisé les ingrédients qui ne peuvent pas être assemblés avec ce dernier.
 * Mettre un symbole quand le chaudron peut être mélangé pour donner une potion.
 * Afficher les caractéristiques de la potion quand le chaudron est mélangé.
 * 
 * Considérer uniquement les potions avec un nombre d'ingrédients 1 <= x <= 9 et avec un effet non nul.
 * 
 * https://wizard-world-api.herokuapp.com/swagger/index.html
 */

 (function() {
    const COMPONENT_NAME = 'wc-elixirs';

    const TEMPLATE = document.createElement('template');
    TEMPLATE.innerHTML = /* html */`
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            #main {
                width: 100vw;
                border: 1px solid black;
            }
            .container {
                display: flex;
            }
            .shelf {
                display: grid;
                grid-template-columns: repeat(9, 1fr);
                grid-gap: 10px;
                width: 50%;

                background: #7a5833;

                border: 50px solid black;
                border-image-source: url("./assets/test.png");
                /* haut | droit | bas | gauche */
                border-image-slice: 75 70;
                /* border-image-slice: 125 250; */
            }
            .ingredient-container {
                text-align: center;
            }
            .ingredient {
                width: 40px;
            }
            .available-ingredient {
                background-color: lightgreen;
            }
            .forbidden-ingredient {
                background-color: lightcoral;
            }
            .reset {
                border: 1px solid blue;
                cursor: pointer;
            }
            .card {
                position: relative;
                height: 160px;
                width: 110px;

                background-image: url("./assets/images.jpg");
                background-size: contain;
                background-repeat: no-repeat;

            }
            .card-image {
                position: relative;
                top: 15%;
                left: 15%;
                height: 45%;
                width: 45%;
                border: 1px red solid;
            }
            .card-image-src {
                height: 100%;
                width: 100%;
            }
            .card-title {
                position: relative;
                width: 66%;
                font-size: 1rem;
                top: 20%;
                left: 5%;
                border: 1px red solid;
                text-align: center;
            }
            
        </style>
        <div id="main">
            <div class="container">
                <div class="shelf"></div>
                <div class="cauldron">
                    <div class="card">
                        <div class="card-image">
                            <img class="card-image-src" src="./assets/ingredients/1.png">
                        </div>
                        <div class="card-title">Le titre de la potion réalisée</div>
                    </div>
                </div>
            </div>
            <div class="reset">Reset</div>
        </div>
    `;

    window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'}); /* ShadowRoot */
        }

        _updateAvailableIngredients(index) {
            this.available_ingredients[index] = false;
            let updated_array = new Array(this.available_ingredients.length).fill(false);
            for (let i = 0; i < this.elixirs.length; i++) {
                let ingredients = this.elixirs[i].ingredients;
                // If the selected ingredient is in the current elixirs ingredients list AND the current elixirs is not eliminated.
                if (ingredients.findIndex(el => el.id == this.ingredients[index].id) != -1 && !this.elixirs_already_seen.includes(this.elixirs[i].id)) {
                    for (let ingredient of ingredients) {
                        updated_array[this.ingredients.findIndex(el => el.id == ingredient.id)] = true;
                    }
                } else {
                    this.elixirs_already_seen.push(this.elixirs[i].id);
                }
            }
            // Update available ingredients with updated array.
            for (let i = 0; i < this.available_ingredients.length; i++) {
                this.available_ingredients[i] = (this.available_ingredients[i] && updated_array[i]);
            }
        }

        _renderCauldron() {
            let cauldron = this.content.querySelector('.cauldron');
            for (let elixir of this.elixirs) {
                if (!this.elixirs_already_seen.includes(elixir.id)) {
                    if (elixir.ingredients.length == this.mixed_ingredients.length) {
                        let button = document.createElement('button');
                        button.addEventListener('click', _ => {
                            console.log(elixir.name);
                        });
                        button.textContent = 'Click on me !';
                        cauldron.appendChild(button);
                    }
                }
            }
        }

        _resetShelf() {
            const _newIngredient = (ingredient) => {
                let div = document.createElement('div');
                div.classList.add('ingredient-container');
                div.classList.add('available-ingredient');
                div.addEventListener('click', _ => {
                    this.mixed_ingredients.push(ingredient.id);
                    this._updateAvailableIngredients(this.ingredients.findIndex(el => el.id == ingredient.id));
                    this._updateShelf();
                    this._renderCauldron();
                });
                let image = document.createElement('img');
                image.classList.add('ingredient');
                image.src = `./assets/ingredients/${this.ingredients.findIndex(el => el.id == ingredient.id)%50 + 1}.png`;
                div.appendChild(image);
                return div;
            };

            let shelf = this.content.querySelector('.shelf');
            shelf.innerHTML = '';
            for (let i = 0; i < this.available_ingredients.length; i++) {
                let ingredient = this.ingredients[i];
                shelf.appendChild(_newIngredient(ingredient, this.available_ingredients[i]));
            }
        }

        _updateShelf() {
            let shelf = this.content.querySelector('.shelf');
            for (let i = 0; i < shelf.children.length; i++) {
                let div = shelf.children[i];
                if (this.available_ingredients[i]) {
                    div.classList.remove('forbidden-ingredient');
                    div.classList.add('available-ingredient');
                } else {
                    div.classList.add('forbidden-ingredient');
                    div.classList.remove('available-ingredient');
                }
            }
        }

        _reset() {
            this.elixirs_already_seen  = [];
            this.available_ingredients = new Array(this.ingredients.length).fill(true);
            this.mixed_ingredients     = [];
            this._resetShelf();            
        }

        _init() {
            const _filterElixirs = (all_elixirs) => {
                let elixirs = all_elixirs.filter(el => el.ingredients.length > 1 && el.ingredients.length <= 5 && el.effect != null);
                
                return all_elixirs.filter(el => el.ingredients.length > 1 && el.ingredients.length <= 4 && el.effect != null);
            };
            const _getAllIngredients = (elixirs) => {
                return elixirs.reduce((acc, el) => {
                    for (let ingredient of el.ingredients) {
                        if (acc.findIndex(it => it.id == ingredient.id) == -1) {
                            acc.push(ingredient);
                        }
                    }
                    return acc;
                }, []);
            };

            /**
             * Include axios part and if an error is receive use data.js.
             */
            let all_elixirs = getElixirs();

            this.elixirs = _filterElixirs(all_elixirs);
            this.ingredients = _getAllIngredients(this.elixirs);
            this.available_ingredients = new Array(this.ingredients.length).fill(true);

            console.log(`${all_elixirs.length} elixirs au total.`);
            console.log(`${this.elixirs.length} elixirs filtrés.`);
            console.log(`${this.ingredients.length} ingrédients au total.`);

            // this._resetShelf();
        }

        _initEvents() {
            (() => {
                let reset = this.content.querySelector('.reset');
                reset.addEventListener('click', this._reset.bind(this));
            })();
        }

        connectedCallback() {
            this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
            this.content = this.shadowRoot.querySelector('#main');
            /* Attributes */
            this.elixirs               = [];
            this.elixirs_already_seen  = [];
            this.ingredients           = [];
            this.available_ingredients = [];
            this.mixed_ingredients     = [];
            /* Inits */
            this._init();
            this._initEvents();
        }

        disconnectedCallback() {}
    });
})();