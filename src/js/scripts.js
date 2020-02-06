$(document).ready(function () {
    // Variables
    var workers = [
        {
            name: 'Adam Nowak',
            id: 1,
            tasks: [
                {
                    id: 1,
                    name: 'Zadanie 1',
                    price: 120
                },
                {
                    id: 2,
                    name: 'Zadanie 2',
                    price: 300
                },
                {
                    id: 3,
                    name: 'Zadanie 3',
                    price: 200
                }
            ]
        },
        {
            name: 'Michał Potoczek',
            id: 2,
            tasks: [
                {
                    id: 1,
                    name: 'Zadanie 1',
                    price: 320
                },
                {
                    id: 2,
                    name: 'Zadanie 2',
                    price: 450
                },
                {
                    id: 3,
                    name: 'Zadanie 3',
                    price: 670
                }
            ]
        },
        {
            name: 'Antoni Worek',
            id: 3,
            tasks: [
                {
                    id: 1,
                    name: 'Zadanie 1',
                    price: 875
                },
                {
                    id: 2,
                    name: 'Zadanie 2',
                    price: 435
                },
                {
                    id: 3,
                    name: 'Zadanie 3',
                    price: 1256
                }
            ]
        }
    ],
        euroCourse = 4.8282,
        activeWorker = 1;

    var app = $('#app'),
        course = app.find('.course'),
        customSelect = app.find('.custom-select'),
        workersLists = app.find('.custom-select ul'),
        searchWorker = app.find('.search-worker'),
        tasksLists = app.find('.tasks-lists'),
        workerInput = app.find('#workers'),
        sumPln = app.find('.sumPLN'),
        sumEur = app.find('.sumEURO'),
        sortNameAsc = app.find('.sort-name-asc'),
        sortNameDesc = app.find('.sort-name-desc'),
        sortPricePlnAsc = app.find('.sort-pricePln-asc'),
        sortPricePlnDesc = app.find('.sort-pricePln-desc'),
        sortPriceEurAsc = app.find('.sort-priceEur-asc'),
        sortPriceEurDesc = app.find('.sort-priceEur-desc');

    // Set euro course
    course.text(euroCourse);

    // Create workers lists
    function createWorkersLists(workers) {
        var workersListsHTML = '';
        workers.forEach(function (worker) {
            workersListsHTML += `
        <li class="${worker.id === activeWorker ? 'active' : ''}" data-id=${worker.id}>
            <span style="background-image: url('./src/images/user.png')"></span>
            <p>${worker.name}</p>
            <i class="fas fa-check"></i>
        </li>
        `
        });
        workersLists.html(workersListsHTML);
    }
    createWorkersLists(workers);

    // Check active worker
    workersLists.on('click', 'li', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        activeWorker = $(this).data('id');
        var selectedWorker = workers.find(function (worker) {
            return worker.id === activeWorker;
        });
        workerInput.val(selectedWorker.name);
        generateTable();
    });

    // Search worker
    searchWorker.on('click', function (e) {
        e.stopPropagation();
        searchWorker.addClass('active');
        $(this).closest(searchWorker).find('label').text('Szukaj');
        $(document).on('click', function (e) {
            e.stopPropagation();
            searchWorker.removeClass("active");
            searchWorker.find('label').text('Pracownik');
        });
    });

    // Filter workers
    workerInput.on('change, keyup', function (e) {
        var matchWorkers = workers.filter(function (worker) {
            const regex = new RegExp(e.target.value, 'gi');
            return worker.name.match(regex);
        });
        createWorkersLists(matchWorkers);
    });

    // Validation input
    $(".add-task").on('submit', function (e) {
        e.preventDefault();
        var taskName = $("#task-name");
        var taskPrice = $("#task-price");
        var taskNameVal = taskName.val();
        var taskPriceVal = taskPrice.val();
        var taskNameError = taskName.closest('.form-group').find('.error');
        var taskPriceError = taskPrice.closest('.form-group').find('.error');
        if (taskNameVal.length === 0) {
            taskNameError.addClass('active');
            taskName.addClass('errorBorder');
        } else if (taskNameVal.length <= 5) {
            taskNameError.addClass('active');
            taskName.addClass('errorBorder');
        } else {
            taskNameError.removeClass('active');
            taskName.removeClass('errorBorder')
        }
        if (taskPriceVal.length === 0) {
            taskPriceError.addClass('active');
            taskPrice.addClass('errorBorder');
        } else {
            taskPriceError.removeClass('active');
            taskPrice.removeClass('errorBorder');
        }
        if (taskNameVal.length >= 5 && taskPriceVal.length !== 0) {
            taskName.val('');
            taskPrice.val('');
            var workerIndex = generateWorkerIndex();
            workers[workerIndex].tasks.push({
                id: idGen.getId(),
                name: taskNameVal,
                price: parseInt(taskPriceVal)
            });
            generateTable();
        }

    });

    // Generate table
    function generateTable() {
        var currentWorker = workers.filter(function (worker) {
            return activeWorker === worker.id;
        });
        var workersTasksHTML = '';
        var sumPrice = 0;
        currentWorker[0].tasks.forEach(function (task) {
            workersTasksHTML += `
                <tr>
                    <td data-label="Nazwa zadania" class="name">${task.name}</td>
                    <td data-label="Kwota w PLN" class="pricePLN">${task.price.toFixed()} PLN</td>
                    <td data-label="Kwota w EURO" class="priceEURO">${(task.price / euroCourse).toFixed()} EUR</td>
                    <td data-label="Opcje">
                        <span data-id=${task.id} class="delete-task">
                            <i class="fas fa-trash"></i>Usuń
                        </span>
                    </td>
                </tr>
            `;
            sumPrice += task.price;
        });
        sumPln.text(sumPrice.toFixed());
        sumEur.text((sumPrice / euroCourse).toFixed());
        if (workersTasksHTML === '') {
            workersTasksHTML += `
                <tr>
                    <td colspan="4" style="text-align: center">Brak zadań w tablicy</td>
                </tr>
            `;
        }
        tasksLists.html(workersTasksHTML);
    }
    generateTable();

    // Delete task 
    tasksLists.on('click', '.delete-task', function () {
        var taskId = $(this).data('id');
        var workerIndex = generateWorkerIndex();
        var newArrayTasks = workers[workerIndex].tasks.filter(function (task) {
            return task.id !== taskId;
        });
        workers[workerIndex].tasks = newArrayTasks;
        generateTable();
    });

    // Generate workerIndex
    function generateWorkerIndex() {
        var workerIndex = workers.findIndex(function (worker) {
            return worker.id === activeWorker;
        });
        return workerIndex;
    }

    // Generate unique id
    function Generator() { };
    Generator.prototype.rand = Math.floor(Math.random() * 26) + Date.now();
    Generator.prototype.getId = function () {
        return this.rand++;
    };
    var idGen = new Generator();

    // Sortable table
    sortNameAsc.on('click', function () {
        sort(true, 'name', 'table-task');
    });
    sortNameDesc.on('click', function () {
        sort(false, 'name', 'table-task');
    });
    sortPricePlnAsc.on('click', function () {
        sort(true, 'pricePLN', 'table-task');
    });
    sortPricePlnDesc.on('click', function () {
        sort(false, 'pricePLN', 'table-task');
    });
    sortPriceEurAsc.on('click', function () {
        sort(true, 'priceEURO', 'table-task');
    });
    sortPriceEurDesc.on('click', function () {
        sort(false, 'priceEURO', 'table-task');
    });

    function sort(ascending, columnClassName, tableId) {
        var tbody = document.getElementById(tableId).getElementsByTagName(
            "tbody")[0];
        var rows = tbody.getElementsByTagName("tr");
        var unsorted = true;
        while (unsorted) {
            unsorted = false
            for (var r = 0; r < rows.length - 1; r++) {
                var row = rows[r];
                var nextRow = rows[r + 1];
                var value = row.getElementsByClassName(columnClassName)[0].innerHTML;
                var nextValue = nextRow.getElementsByClassName(columnClassName)[0].innerHTML;
                value = value.replace(',', ''); // in case a comma is used in float number
                nextValue = nextValue.replace(',', '');
                if (!isNaN(value)) {
                    value = parseFloat(value);
                    nextValue = parseFloat(nextValue);
                }
                if (ascending ? value > nextValue : value < nextValue) {
                    tbody.insertBefore(nextRow, row);
                    unsorted = true;
                }
            }
        }
    };
});

