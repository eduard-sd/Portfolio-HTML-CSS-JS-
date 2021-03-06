const movieButton = document.querySelector("#movie-button"),
      favoriteButton = document.querySelector("#favorite-button"),
      searchButton = document.querySelector('.form-inline button'),
      searchInput = document.querySelector('.form-inline input'),
      tagsSelector = document.querySelector("#movie-tags"),
      accordionFavorite = document.querySelector("#accordionFavorite"),
      favoriteTab = document.querySelector("#profile-tab"),
      MOVIE_URL =  'js/jsons/films.json',
      tagsArray = [],
      visibleMoviesList = [];
let favoriteVisibleMoviesList = [],
    mainMovieField = document.querySelectorAll("#accordionFilm, #accordionFavorite"),
    searchMatchesList = [],
    tagsFilter = [],
    tagsFilterResult = [],
    buttonBool = false,
    filteredMovieList = [];



const getFavoriteList = () => {
    return JSON.parse(localStorage.getItem("favorite"));
};
const setFavoriteList = (key, obj) => {
    let sObj = JSON.stringify(obj);
    return localStorage.setItem(key, sObj);
};
try {
    if (getFavoriteList().length > 0) {
        favoriteVisibleMoviesList = getFavoriteList();
    }
} catch(e) {
    console.log(e);
} // пробуем получить данные из хранилища

const addVisibleMovies = (list) => {
    const accordionFilm = document.querySelector("#accordionFilm");
    //рендарим обьекты на страници из лиcта
    const renderFilm = function (item) {
        const  film = `<div class="card" data-movieid="${item.id}">
                    <div class="card-header" id="heading-film-id">
                      <h5 class="mb-0 d-flex justify-content-between">
                        <button class="btn btn-link" type="button" data-title data-toggle="collapse" data-target="#collapse-film-${item.id}" aria-expanded="true" aria-controls="collapseOne">
                          ${item.title}
                        </button>
                        <label class="icons" for="card__icons-checkbox-${item.id}">
                          <input type="checkbox" class="card__icons-checkbox" id="card__icons-checkbox-${item.id}">
                          <i class="fas fa-star card__checkbox"></i>
                        </label>
                      </h5>
                    </div>

                    <div id="collapse-film-${item.id}" class="collapse" aria-labelledby="heading-film-${item.id}" data-parent="#accordionFilm">
                      <div class="card-body" data-description="">
                        Абзац описания фильма: ${item.tags}
                      </div>
                    </div>
                  </div>`;
        accordionFilm.insertAdjacentHTML('beforeend', film);
    };

    const loadMore = (list) => { //работа с количество вывода на странице и с кнопкой
        let moviesOnPage = accordionFilm.children.length;
        let moviesAtAll = list.length;
        let result = moviesAtAll - moviesOnPage;
        if (result >= 15) {
            result = 15;
        }

        result > 0 ? movieButton.style.display = 'block' : movieButton.style.display = 'none';

        for (let i = moviesOnPage; i < moviesOnPage + result; i++) {
            if (list === visibleMoviesList) {
                renderFilm(list[i]);
            } else {
                const itemIndex = visibleMoviesList.findIndex(x => x.id === filteredMovieList[i]);
                renderFilm(visibleMoviesList[itemIndex]);
            }
        }

    }; //определяет сколько осталось показать из списка, определяет список показа
    loadMore(list);

    try {
        // если в favoriteVisibleMoviesList.length > 0 то для каждого обекта находим копию в visibleMoviesList и ставим checked
        if (getFavoriteList().length > 0) {
            for (let i = 0; i < favoriteVisibleMoviesList.length; i++) {
                let idFavorite = favoriteVisibleMoviesList[i].id;
                let itemIndex = visibleMoviesList.findIndex(x => x.id === idFavorite);
                visibleMoviesList[itemIndex].favorite = true;
                let itemMakeChecked = accordionFilm.querySelector(`#card__icons-checkbox-${idFavorite}`).checked = true;
            }
        }
    } catch(e) {console.log(e)}

}; // показывает на странице фильмы
const addVisibleTags = () => {
    const tagsJson =  'js/jsons/tags.json';

    async function main2 (path) {
        const responce = await fetch(path);
        data = await responce.json();
        for (let i = 0; i < data.length ; i++) {
            tagsArray.push(
                {
                    id : i,
                    title: data[i],
                    checked: true,
                }
            );
            renderTags(tagsArray[i]);
        }
    }

    main2(tagsJson); // заполняем новый лист обьектами с id

    //рендарим обьекты на странице из листа
    const renderTags = function (item) {
        const tags = `<div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="inlineCheckbox-${item.id}" data-id="${item.id}" value="option1">
                            <label class="form-check-label" for="inlineCheckbox-${item.id}">${item.title}</label>
                       </div>`;
        tagsSelector.insertAdjacentHTML('beforeend', tags);
    };
}; // показывает на странице тэги
const addVisibleFavorite = (targetId) => {
    //рендарим обьекты на страници из листа
    const renderFavorite = function (item) {
        const  film = `<div class="card" data-movieid="${item.id}">
                    <div class="card-header" id="heading-film-id">
                      <h5 class="mb-0 d-flex justify-content-between">
                        <button class="btn btn-link" type="button" data-title data-toggle="collapse" data-target="#collapse-film-${item.id}" aria-expanded="true" aria-controls="collapseOne">
                          ${item.title}
                        </button>
                        <label class="icons" for="card__icons-checkbox-${item.id}">
                          <input type="checkbox" class="card__icons-checkbox" id="card__icons-checkbox-${item.id}" checked="${item.favorite}">
                          <i class="fas fa-star card__checkbox"></i>
                        </label>
                      </h5>
                    </div>

                    <div id="collapse-film-${item.id}" class="collapse" aria-labelledby="heading-film-${item.id}" data-parent="#accordionFilm">
                      <div class="card-body" data-description="">
                        Абзац описания фильма
                      </div>
                    </div>
                  </div>`;
        accordionFavorite.insertAdjacentHTML('beforeend', film);
    };
    const itemIndex = favoriteVisibleMoviesList.findIndex(x => x.id === targetId);
    favoriteVisibleMoviesList[itemIndex].favorite = true;
    renderFavorite(favoriteVisibleMoviesList[itemIndex]);
}; // рендерит избранное
const removeFavoriteMovie = (targetId) => {
    const itemIndex = favoriteVisibleMoviesList.findIndex(x => x.id === targetId);
    favoriteVisibleMoviesList.splice(itemIndex,1);

    let itemForRemove = accordionFavorite.querySelector('[data-movieid ="' + targetId + '"]');
    itemForRemove.remove();
}; // удаляет по строчно из избранного
async function loadMovies (path) {
    const responce = await fetch(path);
    const data = await responce.json();
    for (let i = 0; i < data.length ; i++) {
        visibleMoviesList.push(
            {
                id : i,
                title: data[i].title,
                tags: data[i].tags,
                favorite: false,
            }
        );
    }
};
const compareFilters = (search,tags) => {
    filteredMovieList = [];
    if (search.length > 0 && tags.length > 0) {
        filteredMovieList = search.filter(value => -1 !== tags.indexOf(value));
    } else if (search.length === 0 && tags.length > 0) {
        filteredMovieList = tags.slice();
    } else if (tags.length === 0 && search.length > 0) {
        filteredMovieList = search.slice();
    }

    // освобождаем место - удаляем строки
    let list1 = document.querySelector("#accordionFilm").children;
    for (let i = list1.length-1; i >= 0; --i) {
        list1[i].remove();
    }

    buttonBool = true; // для кнопки после смены фильтров

    //показываем основной список фильмов
    let allUncheck = tagsArray.findIndex(x => x.checked === false);
    if (filteredMovieList.length === 0 && !searchInput.value && allUncheck === -1 ) {
        buttonBool = false;
        addVisibleMovies(visibleMoviesList);
    }

    //показываем фитрованный список фильмов
    if (filteredMovieList.length > 0) {
        addVisibleMovies(filteredMovieList);
    }
}; // фильтр поиска и тегов в тандеме


checkRefresh = async () => {
    await loadMovies(MOVIE_URL); // создаем список обьектов из json
    addVisibleMovies(visibleMoviesList); // рендорим на странице

    movieButton.onclick = () => { // + 15 видео по кнопке если false то filteredMovieList если true то visibleMoviesList
        buttonBool ? addVisibleMovies(filteredMovieList) : addVisibleMovies(visibleMoviesList);
    }; // рендерит дополнительные 15 фильмов

    addVisibleTags(); // рендорит тэги

    mainMovieField.forEach((elem) => {
        elem.addEventListener('change', function (event){
            const idString = event.target.closest('[data-movieid]').dataset.movieid;
            const id = parseInt(idString);

            if (visibleMoviesList[id].favorite) {
                visibleMoviesList[id].favorite = false;
                removeFavoriteMovie(id);

                localStorage.removeItem("favorite");

                setFavoriteList("favorite", favoriteVisibleMoviesList); // добавляем в localStorage

            } else if (!visibleMoviesList[id].favorite) {
                visibleMoviesList[id].favorite = true;
                favoriteVisibleMoviesList.push(visibleMoviesList[id]);

                addVisibleFavorite(id); // рендеринг

                // addVisibleMovies(favoriteVisibleMoviesList);

                setFavoriteList("favorite", favoriteVisibleMoviesList); // добавляем в localStorage
            }
        })
    }); // отслеживает события с чекбоксами добавить в избранное

    loadMoreFavorite = () => {
        let moviesOnPage = accordionFavorite.children.length;
        let moviesAtAll = favoriteVisibleMoviesList.length;
        let result = moviesAtAll - moviesOnPage;
        if (result >= 15) {
            result = 15;
        }
        result > 0 ? favoriteButton.style.display = 'block' : favoriteButton.style.display = 'none';

        for (let i = moviesOnPage; i < moviesOnPage + result; i++) {
            let id = favoriteVisibleMoviesList[i].id;
            addVisibleFavorite(id);
        }

        accordionFavorite.children.length === moviesAtAll ? favoriteButton.style.display = 'none' : favoriteButton.style.display = 'block';
    };
    favoriteTab.onclick = () => {
        if (accordionFavorite.children.length === 0) {
            loadMoreFavorite();
        }
    }; // рендерит избранное после перезагрузки
    favoriteButton.onclick = () => {
        loadMoreFavorite();
    }; //рендерит избранное избранные фильмы +15 по кнопке

    searchButton.onclick = () => {
        searchMatchesList = [];
        for (let i = 0; i < visibleMoviesList.length; i++) {
            let titleLowCase = visibleMoviesList[i].title.toLowerCase();
            let searchLowCase = searchInput.value.trim().toLowerCase();

            let word = '';
            for (let j = 0; j < searchLowCase.length; j++) {
                if(searchLowCase.charAt(j) === titleLowCase.charAt(j)){
                    word += searchLowCase.charAt(j);
                } else {
                    j = searchLowCase.length;
                    word = '';
                }
            }

            if(word === searchLowCase) {
                searchMatchesList.push(visibleMoviesList[i].id) // :TODO добавить .id чтоб сравнивать по id
            }
        }

        compareFilters (searchMatchesList,tagsFilterResult);
    }; // фильтр поиска

    const tagsSelectorList = document.querySelectorAll("#movie-tags");
    tagsSelectorList.forEach((elem) => {
        elem.addEventListener('change', function (event){
            const dataId = event.target.closest('[data-id]').dataset.id;
            const id = parseInt(dataId);

            if (tagsArray[id].checked) {
                tagsFilter.push(tagsArray[id].title);
                tagsArray[id].checked = false;

            } else if (!tagsArray[id].checked) {
                let itemIndex = tagsFilter.indexOf(tagsArray[id].title);
                tagsFilter.splice(itemIndex,itemIndex+1);
                tagsArray[id].checked = true;
            }

            tagsFilterResult = [];
            for (let i = 0; i < visibleMoviesList.length; i++) {
                let movieTagsList = visibleMoviesList[i].tags;
                let list = [];
                for (let j = 0; j < tagsFilter.length; j++) {
                    if(movieTagsList.includes(tagsFilter[j])){
                        list.push(tagsFilter[j]);
                    } else {
                        j = tagsFilter.length;
                        list = [];
                    }
                }

                if(list.length > 0) {
                    tagsFilterResult.push(visibleMoviesList[i].id) // :TODO добавить .id чтоб сравнивать по id
                }
            }
            compareFilters (searchMatchesList,tagsFilterResult);
        })
    }); // фильтр по тегам
};

window.onbeforeunload = checkRefresh();

