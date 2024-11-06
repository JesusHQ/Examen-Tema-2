let showLastRecord = true; // Variable para rastrear el estado del botón

// Función para alternar entre último registro y últimos 10 registros
function toggleRecords() {
    showLastRecord = !showLastRecord;
    const button = document.getElementById("toggle-button");

    if (showLastRecord) {
        button.textContent = "Mostrar los últimos 10 registros";
        fetchLastData();
    } else {
        button.textContent = "Mostrar el último registro";
        fetchLastTenData();
    }
}

// Función para enviar la operación de control a la base de datos
function sendOperation(operation) {
    const operations = {
        1: { status: 1, accion: "adelante" },
        2: { status: 2, accion: "atrás" },
        3: { status: 3, accion: "izquierda" },
        4: { status: 4, accion: "derecha" },
        5: { status: 5, accion: "detener" },
        6: { status: 6, accion: "giro derecha" },
        7: { status: 7, accion: "giro izquierda" },
        8: { status: 8, accion: "luces delantera" },
        9: { status: 9, accion: "luces trasera" }
    };

    const operationData = operations[operation];
    if (!operationData) {
        console.error("Operación no válida");
        return;
    }

    fetch('/api/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: operationData.status,
            ip_cliente: "192.168.1.1", // Cambia esto según sea necesario
            name: "Carro1",            // Cambia esto según sea necesario
            id_device: "12345",        // Cambia esto según sea necesario
            accion: operationData.accion
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Operación enviada:", data);
        fetchLastData(); // Actualiza la tabla para mostrar el último registro
    })
    .catch(error => console.error("Error al enviar la operación:", error));
}

// Función para obtener el último registro de la API y actualizar la tabla
function fetchLastData() {
    fetch('/api/status/last')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("last-data-body");
            tbody.innerHTML = '';  // Limpiamos el contenido previo

            // Crear una nueva fila con el último dato
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.status}</td>
                <td>${data.accion}</td>
                <td>${data.ip_cliente}</td>
                <td>${data.name}</td>
                <td>${data.id_device}</td>
                <td>${data.date}</td>
            `;
            tbody.appendChild(row);
        })
        .catch(error => console.error("Error al obtener el último registro:", error));
}

// Función para obtener los últimos 10 registros de la API y actualizar la tabla
function fetchLastTenData() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("last-data-body");
            tbody.innerHTML = '';  // Limpiamos el contenido previo

            // Crear una fila por cada uno de los 10 registros obtenidos
            data.slice(-10).forEach(record => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${record.id}</td>
                    <td>${record.status}</td>
                    <td>${record.accion}</td>
                    <td>${record.ip_cliente}</td>
                    <td>${record.name}</td>
                    <td>${record.id_device}</td>
                    <td>${record.date}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al obtener los últimos 10 registros:", error));
}

// Llamamos a fetchLastData para cargar el último dato al cargar la página
window.onload = () => {
    fetchLastData();
    setInterval(() => {
        if (showLastRecord) {
            fetchLastData();
        } else {
            fetchLastTenData();
        }
    }, 10000); // Actualizar automáticamente cada 10 segundos según el modo actual
};
