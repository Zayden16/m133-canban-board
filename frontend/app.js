var cardId = 0;

function load() {
    document.querySelector("#add").addEventListener("click", addCard);

    getCards();
}

function addEvents() {
    const listItems = document.querySelectorAll('.card');
    const lists = document.querySelectorAll('.card-list');

    let draggedItem = null;

    for (let i = 0; i < listItems.length; i++) {
        const item = listItems[i];

        item.addEventListener('dragstart', function () {
            draggedItem = item;
            setTimeout(function () {
                item.style.display = 'none';
            }, 0)
        });

        item.addEventListener('dragend', function () {
            setTimeout(function () {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        })

        for (let j = 0; j < lists.length; j++) {
            const list = lists[j];

            list.addEventListener('dragover', function (e) {
                e.preventDefault();
                this.style.backgroundColor = '#cc6633';
            });

            list.addEventListener('dragenter', function (e) {
                e.preventDefault();
                this.style.backgroundColor = '#323234';
            });

            list.addEventListener('dragleave', function (e) {
                this.style.backgroundColor = '#212121';
            });

            list.addEventListener('drop', function (e) {
                console.log('drop');
                this.append(draggedItem);
                this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            });
        }
    }
}

function getCards(callback) {
    fetch('/api/LoadCards')
        .then(
            function (response) {
                response.json().then(function (data) {
                    cardId = data[data.length - 1].id;
                    createCards(data);
                    addEvents();
                });
            }
        )
        .catch(function (err) {
            callback(false, err);
            console.log('Fetch Error :-S', err);
        });
}

function createCards(cards) {
    var todo = document.querySelector("#todo");
    var inProgress = document.querySelector("#in-progess");
    var done = document.querySelector("#done");

    todo.innerHTML = "<h1>To-Do</h1>";
    inProgress.innerHTML = "<h1>In-Progress</h1>";
    done.innerHTML = "<h1>Done</h1>";

    for (var i = 0; i < cards.length; i++) {
        var card = `<article class="card" draggable="true">
                        <header class="card-header">
                            <h2>${cards[i].title}</h2>
                            <p>${cards[i].text}</p>
                        </header>
                    </article>`;

        if (cards[i].position == 1) { // In Progress
            inProgress.innerHTML += card;

        } else if (cards[i].position == 2) { // Done  
            done.innerHTML += card;

        } else { // To Do
            todo.innerHTML += card;
        }
    }
}

function addCard() {
    cardId++

    var card = {
        id: cardId,
        title: "Test Title " + cardId,
        text: "Test Text " + cardId,
        position: 0
    }

    fetch("/api/AddCard", {
        body: JSON.stringify(card),
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST"
    });

    getCards();
}