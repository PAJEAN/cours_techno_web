(function() {
    const COMPONENT_NAME = 'wc-table';

    const TEMPLATE = document.createElement('template');
    TEMPLATE.innerHTML = /* html */`
        <style>
            
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: "Oswald", Helvetica Neue;
            }
            #main {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            .styled-table {
                border-collapse: collapse;
                overflow: hidden;
                border-radius: 5px;
                font-size: 0.9em;
                min-width: 400px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }
            .styled-table thead tr {
                background-color: #009879;
                color: #ffffff;
                text-align: center;
            }
            .styled-table th,
            .styled-table td {
                padding: 10px 15px;
            }
            .styled-table tbody tr {
                border-bottom: 1px solid #dddddd;
                text-align: center;
                text-transform: capitalize;
            }
            .styled-table tbody tr td img {
                width: 40px;
                height: 40px;
                object-fit: cover;
            }
            .styled-table tbody tr td:first-child img {
                border: 2px solid #618E6D;
                border-radius:50%;
            }
            .styled-table tbody tr:nth-of-type(even) {
                background-color: #f3f3f3;
            }

            .styled-table tbody tr:nth-of-type(odd) {
                background-color: #E8F4EB;
            }

            .styled-table tbody tr:last-of-type {
                border-bottom: 2px solid #009879;
            }
            .styled-table tbody tr.active-row {
                font-weight: bold;
                color: #009879;
            }
            /*__________________*/
            /**** PAGINATION ****/
            /*__________________*/
            .pagination {
                display: inline-block;
                margin: 0 auto;
            }
            .pagination div {
                color: black;
                float: left;
                padding: 8px 16px;
                text-decoration: none;
                border: 1px solid #bbb;
                background: #E8F4EB;
                cursor: pointer;
            }
            .pagination div.active {
                background-color: #009879;
                color: white;
                border: 1px solid #4CAF50;
            }
            .pagination div:hover:not(.active) {
                background-color: #ddd;
            }
            .pagination div:first-child {
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
            }
            .pagination div:last-child {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
            }
            /*________________*/
            /**** CAROUSEL ****/
            /*________________*/
            .my-slide {
                display: none;
            }
            
            /* Slideshow container */
            .slideshow-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100%;
            }

            /* Next & previous buttons */
            .prev, .next {
                cursor: pointer;
                position: fixed;
                top: 50%;
                width: auto;
                padding: 15px 30px;
                color: white;
                font-weight: bold;
                font-size: 18px;
                transition: 0.6s ease;
                border-radius: 0 3px 3px 0;
                user-select: none;
                background-color: rgba(0,0,0,0.5);
            }
            .prev {
                left: 0;
            }
            /* Position the "next button" to the right */
            .next {
                right: 0;
                border-radius: 3px 0 0 3px;
            }

            /* On hover, add a black background color with a little bit see-through */
            .prev:hover, .next:hover {
                background-color: rgba(0,0,0,0.8);
            }
            /* Fading animation */
            .fade {
                animation-name: fade;
                animation-duration: 1.5s;
            }
            @keyframes fade {
                from {opacity: .4} 
                to {opacity: 1}
            }
            /* On smaller screens, decrease text size */
            @media only screen and (max-width: 300px) {
                .prev, .next, .text {font-size: 11px}
            }
            /*______________*/
            /**** PANELS ****/
            /*______________*/
            .table-panel {
                gap: 20px;
            }
            .table-panel input {
                padding: 15px 30px;
                border-radius: 10px;
                background-image: url('assets/flash.png');
                background-size: 25px;
                background-position: 5px 10px; 
                background-repeat: no-repeat;
                width: 100%;
            }
            .stats-panel {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 40px;
            }
            .stats-panel > div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
            }
            .stats-panel img {
                width: 100px;
                height: 100px;
                object-fit: cover;
            }
            h2 {
                padding: 30px 0 0 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Harry Potter', sans-serif;
                font-size: 4rem;
                text-align: center;
            }
            

        </style>
        <div id="main">
            <h2>Harry Potter Mining</h2>
            <div class="slideshow-container">
                <div class="table-panel my-slide fade">
                    <input type="text" placeholder="Search" class="search">
                    <table class="styled-table">
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                    <div class="pagination"></div>
                </div>
                <div class="stats-panel my-slide fade"></div>
                <a class="prev">❮</a>
                <a class="next">❯</a>
            </div>
        </div>
    `;

    window.customElements.define(COMPONENT_NAME, class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: 'open'}); /* ShadowRoot */
        }

        _newTHead() {
            let thead_tag = this.content.querySelector('thead');
            let tr = document.createElement('tr');
            for (let thead of this.thead) {
                let td = document.createElement('td');
                switch(thead.key) {
                    case 'name':
                        td.textContent = thead.name + ' ▴';
                        td.style.cursor = 'pointer';
                        td.addEventListener('click', _ => {
                            this._sortByName();
                            if (this.sort_way == 1) {
                                td.textContent = thead.name + ' ▴';
                            } else {
                                td.textContent = thead.name + ' ▾';
                            }
                        });
                        break;
                    default:
                        td.textContent = thead.name;
                }
                tr.appendChild(td);
            }
            thead_tag.appendChild(tr);
        }

        _newTBody() {
            const _newLine = (character) => {
                let tr = document.createElement('tr');
                for (let thead of this.thead) {
                    let td = document.createElement('td');
                    switch (thead.key) {
                        case 'image':
                            var img = document.createElement('img');
                            img.src = character.image && this.is_connected ? character.image: 'assets/choixpeau.jpg';
                            // img.src = 'assets/choixpeau.jpg';
                            td.appendChild(img);
                            break;
                        case 'wizard':
                            if (character[thead.key]) {
                                var img = document.createElement('img');
                                img.src = 'assets/wizard.png';
                                td.appendChild(img);
                            } else {
                                td.textContent = '-';
                            }
                            break;
                        case 'house':
                            if (character[thead.key]) {
                                let img = document.createElement('img');
                                switch (character[thead.key]) {
                                    case 'Gryffindor':
                                        img.src = 'assets/gryffindor.png';
                                        break;
                                    case 'Ravenclaw':
                                        img.src = 'assets/ravenclaw.png';
                                        break;
                                    case 'Hufflepuff':
                                        img.src = 'assets/hufflepuff.png';
                                        break;
                                    case 'Slytherin':
                                        img.src = 'assets/slytherin.png';
                                        break;
                                }
                                td.appendChild(img);
                            } else {
                                td.textContent = '-';
                            }
                            break;
                        case 'gender':
                            var img = document.createElement('img');
                            switch (character[thead.key]) {
                                case 'male':
                                    img.src = 'assets/male.png';
                                    break;
                                case 'female':
                                    img.src = 'assets/female.png';
                                    break;
                            }
                            td.appendChild(img);
                            break;
                        default:
                            td.textContent = character[thead.key] ? character[thead.key] : '-';;
                    }
                    tr.appendChild(td);
                }
                return tr;
            }

            let tbody_tag = this.content.querySelector('tbody');
            tbody_tag.textContent = '';
            let lim = (this.current_page * this.items_by_page + this.items_by_page) > this.characters.length ? this.characters.length: (this.current_page * this.items_by_page + this.items_by_page);
            for (let i = (this.current_page * this.items_by_page); i < lim; i++) {
                tbody_tag.appendChild(_newLine(this.characters[i]));
            }
        }

        _sortByName() {
            if (this.sort_way <= 0) {
                this.sort_way = 1;
                this.characters.sort((a, b) => {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            } else {
                this.sort_way = -1;
                this.characters.sort((b, a) => {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            }
            this._newTBody();
            this._newPagination();
            this._activePage();
        }

        _setCurrentPage(num) {
            this.current_page = num;
            this._newTBody();
            this._newPagination();
            this._activePage();
        }

        _activePage() {
            let pagination = this.content.querySelector('.pagination');
            Array.from(pagination.children).forEach(el => {
                el.classList.remove('active');
                if (el.textContent == (this.current_page + 1).toString()) { // Due to < and > tag.
                    el.classList.add('active');
                }
            });
        }

        _newPagination() {
            const _newDivTag = (content, num, add_event) => {
                let div_tag = document.createElement('div');
                div_tag.textContent = content;
                if (add_event) {
                    div_tag.addEventListener('click', _ => {
                        this._setCurrentPage(num);
                    });
                }
                return div_tag;
            };
            const _newDivBorderTag = (content, is_inf) => {
                let div_tag = document.createElement('div');
                div_tag.textContent = content;
                div_tag.addEventListener('click', _ => {
                    this._setCurrentPage(is_inf ? 
                        (this.current_page - 1 > 0  ? this.current_page - 1: 0) :
                        (this.current_page + 1 < this._totalPage()  ? this.current_page + 1: this._totalPage()));
                });
                return div_tag;
            };

            let pagination_tag = this.content.querySelector('.pagination');
            pagination_tag.textContent = '';
            pagination_tag.appendChild(_newDivBorderTag('← prev', true));

            let size = 2;
            let lim_inf = this.current_page - size > 0 ? this.current_page - size: 0;
            let lim_sup = this.current_page + size >= this._totalPage() ? this._totalPage(): this.current_page + size;
            
            if (lim_inf > 0) {
                pagination_tag.appendChild(_newDivTag(1, 0, true));
                pagination_tag.appendChild(_newDivTag('...', 0, false));
            }
            for (let i = lim_inf; i <= lim_sup; i++) {
                pagination_tag.appendChild(_newDivTag(i + 1, i, true));
            }
            if (lim_sup < this._totalPage()) {
                pagination_tag.appendChild(_newDivTag('...', 0, false));
                pagination_tag.appendChild(_newDivTag(this._totalPage() + 1, this._totalPage(), true));
            }
            pagination_tag.appendChild(_newDivBorderTag('next →', false));
        }
        
        _totalPage() {
            return Math.floor(this.characters.length / this.items_by_page);
        }

        _setStatsPanel() {
            const _newStatItem = (image, content) => {
                let div = document.createElement('div');
                let img = document.createElement('img');
                img.src = image;
                div.appendChild(img);
                div.appendChild(document.createTextNode(content));
                return div;
            };

            let panel = this.content.querySelector('.stats-panel');
            (() => {
                let stats = {'gryffindor': 0, 'slytherin': 0, 'ravenclaw': 0, 'hufflepuff': 0, 'male': 0, 'female': 0};
                let species = [];
                let wizard = 0;
                let human = 0;
                let hogwarts_student = 0;
                let eyes = [];
                let wand = [0, 0];
                for (let character of this.origin_characters) {
                    if (character.house && character.house.toLowerCase() in stats) stats[character.house.toLowerCase()] += 1;
                    if (character.gender && character.gender.toLowerCase() in stats) stats[character.gender.toLowerCase()] += 1;
                    if (character.wizard) wizard += 1;
                    if (character.hogwartsStudent) hogwarts_student += 1;
                    if (character.species && !species.includes(character.species)) species.push(character.species);
                    if (character.species && character.species == 'human') human += 1;
                    if (character.eyeColour && !eyes.includes(character.eyeColour)) eyes.push(character.eyeColour);
                    if (character['wand']['length']) {
                        wand[0] += character['wand']['length'];
                        wand[1] += 1;
                    } 
                }
                for (let key in stats) {
                    panel.appendChild(_newStatItem(`assets/${key}.png`, stats[key]));
                }
                panel.appendChild(_newStatItem(`assets/wizard.png`, `${wizard}/${this.origin_characters.length}`));
                panel.appendChild(_newStatItem(`assets/species.png`, `${species.length} species`));
                panel.appendChild(_newStatItem(`assets/human.png`, `${human} humans`));
                panel.appendChild(_newStatItem(`assets/eye.png`, `${eyes.length} colours`));
                panel.appendChild(_newStatItem(`assets/wand.png`, `${Math.floor((wand[0] / wand[1]) * 2.54) }cm (mean)`));
                panel.appendChild(_newStatItem(`assets/hogwarts.png`, `${hogwarts_student} students`));
            })();

          
        }

        _showSlides() {
            let i;
            let slides = this.content.getElementsByClassName('my-slide');
            if (this.current_slide >= slides.length) {
                this.current_slide = 0;
            }
            if (this.current_slide < 0) {
                this.current_slide = slides.length - 1;
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = 'none';
            }
            slides[this.current_slide].style.display = 'grid';
        }

        _init() {
            (() => {
                let size = Math.floor(this.content.querySelector('.slideshow-container').scrollHeight / 100);
                this.items_by_page = size < 1 ? 1: size;
            })();

            this._newTHead();

            axios({
                method: 'get',
                url: 'https://hp-api.onrender.com/api/characters',
            })
            .then((response) => {
                this.origin_characters = response.data;
            })
            .catch((err) => {
                this.is_connected = false;
                this.origin_characters = getCharacters();
            })
            .finally(() => {
                this.characters = [...this.origin_characters];
                this._newTBody();
                this._newPagination();
                this._activePage();
                this._setStatsPanel();
                this._showSlides(this.current_slide);
            });
        }

        _initEvents() {
            (() => {
                let input = this.content.querySelector('.search');
                input.addEventListener('input', _ => {
                    let value = input.value.toLowerCase();
                    this.characters = this.origin_characters.filter(el => {
                        return el.name.toLowerCase().indexOf(value) != -1 ||
                               el.species.toLowerCase().indexOf(value) != -1 || 
                               el.eyeColour.toLowerCase().indexOf(value) != -1 ||
                               el.house.toLowerCase().indexOf(value) != -1 ||
                               el.patronus.toLowerCase().indexOf(value) != -1
                    });
                    this._setCurrentPage(0);
                });
            })();

            (() => {
                let prev = this.content.querySelector('.prev');
                prev.addEventListener('click', _ => {
                    this.current_slide += -1;
                    this._showSlides();
                });
                let next = this.content.querySelector('.next');
                next.addEventListener('click', _ => {
                    this.current_slide += 1;
                    this._showSlides();
                });
            })();
        }

        connectedCallback() {
            this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
            this.content = this.shadowRoot.querySelector('#main');
            /* Attributes */
            this.thead = [
                { key: 'image', name: 'Image' },
                { key: 'name', name: 'Name' },
                { key: 'dateOfBirth', name: 'Date of birth' },
                { key: 'species', name: 'Specie' },
                { key: 'gender', name: 'Gender' },
                { key: 'eyeColour', name: 'Eye colour' },
                { key: 'wizard', name: 'Wizard' },
                { key: 'house', name: 'House' },
                { key: 'patronus', name: 'Patronus' }
            ];
            this.is_connected = true; // If no error to get data from API.
            this.origin_characters = [];
            this.characters = [];
            this.current_page = 0;
            this.items_by_page = 8;
            this.current_slide = 0;
            this.sort_way = 0; // 1 ascending, -1 descending.
            /* Inits */
            this._init();
            this._initEvents();
        }

        disconnectedCallback() {}
    });
})();