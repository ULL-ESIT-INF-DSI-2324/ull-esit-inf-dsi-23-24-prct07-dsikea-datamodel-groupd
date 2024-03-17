[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/a4IaLRGZ)

# Práctica 7 - DSIkea

Guillermo Emmanuel González Méndez - alu0101466941
Oscar Cordobés Navarro - alu0101478081

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd/actions/workflows/node.js.yml)

[![pages-build-deployment](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupd/actions/workflows/pages/pages-build-deployment)

## Índice

- [Introducción](#introducción)
- [Objetivos](#objetivos)
- [Desarrollo de la práctica](#desarrollo-de-la-práctica)
- [Conclusiones](#conclusiones)
- [Bibliografía](#bibliografía)

## Introducción
En esta práctica se ha desarrollado una aplicación de gestión de una tienda de muebles. La aplicación permite gestionar los clientes, los muebles, los proveedores, el stock y las transacciones de la tienda. La aplicación se ha desarrollado en TypeScript y se ha utilizado la librería Inquirer.js para la interacción con el usuario y la librería lowdb para la persistencia de los datos. 

Además, es la primera práctica grupal de la asignatura por lo que hemos tenido que aplicar lo visto a lo largo de la primera parte de la asignatura para trabajar de manera colaborativa en el proyecto.

## Objetivos
- Desarrollar una aplicación de gestión de una tienda de muebles.
- Utilizar TypeScript para el desarrollo de la aplicación.
- Utilizar Inquirer.js para la interacción con el usuario.
- Utilizar lowdb para la persistencia de los datos.
- Trabajar de manera colaborativa en un proyecto.
- Realizar pruebas para comprobar el correcto funcionamiento de la aplicación.
- Documentar el código para la generación de la documentación con TypeDoc.
- Uso de GitHub Actions para el cubrimiento de código, calidad del código e integración continua.

## Estructura del proyecto
Para la estructura del proyecto hemos decidido hacer una serie de clases que representen los diferentes servicios de la base de datos, para operar la misma sin preocuparnos de la implementación. Además, hemos creado una serie de interfaces para representar los diferentes objetos que se manejan en la aplicación y por último, una carpeta con los diferentes menús que se muestran al usuario para interactuar con la aplicación. 

```
/
├── /src
│   ├── /database - Folder with the different services for the database
│   │   ├── /ReportService
│   │   │   ├── ReportService.ts
│   │   │   ├── bestSellingFurniture.ts
│   │   │   └── ...
│   │   ├── ClientService.ts
│   │   ├── FurnitureService.ts
│   │   ├── StockService.ts
│   │   ├── SupplierService.ts
│   │   └── TransactionService.ts
│   ├── /interfaces - Folder with the different interfaces for the application
│   │   ├── IClient.ts
│   │   ├── IFurniture.ts
│   │   ├── IStock.ts
│   │   ├── ISupplier.ts
│   │   └── ITransaction.ts
│   ├── /menu - Folder with the different menus for the application
│   │   ├── ClientsManagement.ts
│   │   ├── common.ts
│   │   ├── ReportsManagement.ts
│   │   ├── StockManagement.ts
│   │   └── SuppliersManagement.ts
│   ├── Stock.ts - Stock class to manage the stock of the store
│   └── index.ts - Main file
├── /data - Folder with the json files used for the database
│   ├── client.json
│   ├── furniture.json
│   ├── suppliers.json
│   ├── transactions.json
│   └── stock.json
└── /tests
    ├── /database - Folder with the tests for the database
    │   ├── /ReportService
    │   │   ├── bestSellingFurniture.test.ts
    │   │   └── ...
    │   ├── ClientService.test.ts
    │   ├── FurnitureService.test.ts
    │   ├── StockService.test.ts
    │   ├── SupplierService.test.ts
    │   └── TransactionService.test.ts
    └── /data - Folder with the json files for testing
        ├── client.json
        ├── furniture.json
        ├── suppliers.json
        ├── transactions.json
        └── stock.json
```

También, para realizar los tests sin interferir con la base de datos real, hemos creado una carpeta con los datos de prueba y, mediante una variable de entorno definida en el script de test, se utiliza la ruta de los datos de prueba en lugar de los datos reales.
```json
"test": "set DB_PATH=./tests/data/ && mocha"
```

Ejemplo en la clase ClientService:
```typescript
  constructor() {
    const dbPath = (process.env.DB_PATH || "./data/").trim();
    this.clientDB = new Low(new JSONFile(`${dbPath}client.json`), []);
    this.initCollection();
  }
```

## Desarrollo de la práctica
En cuanto al desarrollo de la práctica, trabajamos por partes para, orientativamente, hacer una parte cada uno. Dividimos el desarrollo en las siguientes partes:

### Servicios de la base de datos
- **ClientService**: Servicio para gestionar los clientes de la tienda.
- **FurnitureService**: Servicio para gestionar los muebles de la tienda.
- **StockService**: Servicio para gestionar el stock de la tienda.
- **SupplierService**: Servicio para gestionar los proveedores de la tienda.
- **TransactionService**: Servicio para gestionar las transacciones de la tienda.
- **ReportService**: Serie de servicios para generar informes de la tienda.

Todos estos servicios se han desarrollado de manera similar, con una serie de métodos para realizar las operaciones de la base de datos, como búsquedas, eliminaciones, etc. Además, se han desarrollado una serie de tests para comprobar el correcto funcionamiento de los mismos. Cabe destacar que se han utilizado funciones asíncronas en la mayoría de los métodos ya que no podemos asegurar que la operación se haga en el tiempo que esperamos. El ejemplo mas claro es al leer un archivo, ya que si no esperamos a que se complete la operación, podríamos sobre-escribir los datos que estamos leyendo, el cual es un comportamiento no deseado.

### Menús
- **common.ts** - Menú común para la aplicación. En este archivo se encuentra el menú principal de la aplicación y llama a los diferentes submenús.

- **ClientsManagement.ts** - Menú para gestionar los clientes de la tienda. En este menú se pueden realizar operaciones como añadir o mostrar clientes, vender muebles a un cliente, etc.

- **StockManagement.ts** - Menú para gestionar el stock de la tienda. En este menú se pueden realizar operaciones como añadir o mostrar el stock.

- **SuppliersManagement.ts** - Menú para gestionar los proveedores de la tienda. En este menú se pueden realizar operaciones como añadir o mostrar proveedores, así como realizar pedidos a los mismos.

- **ReportsManagement.ts** - Menú para generar informes de la tienda. En este menú se pueden generar informes como todos los muebles vendidos, los muebles más vendidos, etc.

### Clase Stock
La clase Stock es una clase que representa el stock de la tienda. En ella se encuentran los métodos para obtener el stock, añadir clientes, hacer ventas, etc. Esta clase es intermediaria entre los servicios de la base de datos y los menús, llamando a los métodos de los servicios para realizar las operaciones.

### GitHub Actions
En cuanto a GitHub Actions, hemos añadido varios flujos de trabajo para comprobar la calidad del código, el cubrimiento de código y la integración continua. Para ello, hemos utilizado las siguientes acciones:

- node.js - Para comprobar el proyecto en diferentes versiones de node.js.
- coveralls - Para comprobar el cubrimiento de código mediante Coveralls.
- sonarcloud - Para comprobar la calidad del código mediante SonarCloud.

Estas accioens se ejecutan en cada push y pull request a la rama main, por lo que durante el desarrollo hemos trabajado en una rama develop.

## Conclusiones
En esta práctica hemos aprendido a trabajar de manera colaborativa en un proyecto, lo cual es muy importante para el desarrollo de software. Además, hemos aprendido a utilizar Inquirer.js para la interacción con el usuario y lowdb para la persistencia de los datos. 

En cuanto al desarrollo de la aplicación, también vemos las dimensiones que puede llegar a tener un proyecto de software, ya que hemos tenido que dividir el trabajo en diferentes partes para poder realizarlo de manera eficiente y aun así ha sido un trabajo muy grande, pero la experiencia ha sido interesante.

## Bibliografía
- [Inquirer.js](https://www.npmjs.com/package/inquirer)
- [lowdb](https://www.npmjs.com/package/lowdb)
- [Lowdb and some aplication design](https://appliedtechnology.github.io/protips/lowdb.html)