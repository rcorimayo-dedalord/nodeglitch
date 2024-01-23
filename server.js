//https://www.npmjs.com/package/express
//https://expressjs.com/
// Instalación npm i express
//const express = require('express')    //    "type":"commonjs"
import express from 'express'           //    "type":"module"

//console.log('__dirname:', __dirname)          //  "type":"commonjs"
//console.log('process.cwd():', process.cwd())    //  "type":"commonjs" ó "type":"module"

let contadorVisitas = 0

const controladorDefault = (req,res) => {
    const {url:ruta, method:metodo} = req
    res.status(404).send(`<h4>La ruta ${metodo} <span style="color:red;">${ruta}</span> no fue encontrada</h4>`)
}

const middlewareDeRuta = (req,res,next) => {
    console.log('******************************')
    console.log('Hola soy un middleware de ruta')
    console.log('******************************')
    //res.send('<h3>Hola NodeJS desde el middleware de esta ruta</h3>')
    next()
}

const middlewareDeRuta2 = (req,res,next) => {
    console.log('*******************************')
    console.log('Hola soy el middleware2 de ruta')
    console.log('*******************************')
    //res.send('<h3>Hola NodeJS desde el middleware2 de esta ruta</h3>')
    next()
}

const app = express()

app.use(express.json())         // middleware para decodificar información en formato JSON que viene en el body del paquete HTTP
app.use(express.urlencoded({extended: true}))   // middleware para decodificar información en formato x-www-form-urlencoded que viene en el body del paquete HTTP (método default de envío de un form HTML)

app.use((req,res,next) => {
    const {method, url} = req

    /* console.log('--------------------')
    console.log('Soy un middleware personalizado')
    console.log(new Date().toLocaleString())
    console.log(Date.now())
    console.log('method:', method)
    console.log('url:', url)
    console.log('--------------------') */

    if(method == 'GET' && url == '/') contadorVisitas++

    /* if(contadorVisitas > 10) res.send('Ud ha alcanzado el número máximo de visitas')
    else next() */

    next()
})

app.use((req,res,next) => {
    /* console.log('--------------------')
    console.log('Soy otro middleware personalizado')
    console.log('--------------------') */
    next()
})

app.use(express.static('public'))   // middleware del servicio de recursos estáticos de express

// ------------------------------------------------
//            PROCESO DE RUTAS GET
// ------------------------------------------------
app.get('/', (req,res) => {
    //res.send('<p>Ruta raíz del servidor express</p>')
    //res.sendFile('C:\\Cursos\\CursoNodeBackend\\4\\Clase6\\HTTP-Express\\views\\index.html')
    //res.sendFile('C:/Cursos/CursoNodeBackend/4/Clase6/HTTP-Express/views/index.html')
    //res.sendFile(__dirname + '/views/index.html')
    res.sendFile(process.cwd() + '/views/index.html')
})

app.get('/saludo', middlewareDeRuta, middlewareDeRuta2, (req,res) => {
    res.send('<h3>Hola NodeJS desde express</h3>')
})

app.get('/headers', (req,res) => {
    //const headers = req.headers
    const {headers} = req
    console.log({headers})

    res.setHeader('mi-header', 12345678)
    res.setHeader('mi-header2', 87654321)
    res.json({headers})
})

app.get('/visitas', (req,res) => {
    res.send(`<h3>Ud visitó este sitio ${contadorVisitas} ${contadorVisitas == 1? 'vez':'veces'}.</h3>`)
})

app.get('/datos/:nombre/:edad?/:dni?', (req,res) => {
    //const query = req.query       // Query Params
    //const params = req.params     // Route Params
    const {query, params} = req     // Object Destructuring
    console.log({query, params})      

    //res.send('Datos GET recibidos!')
    res.json({query, params})
})

app.get('*', controladorDefault)

// ------------------------------------------------
//            PROCESO DE RUTAS POST
// ------------------------------------------------
app.post('/datos', (req,res) => {
    //const body = req.body
    const {body} = req
    console.log({body})

    //res.send('Datos POST recibidos!!')
    res.json({ body })
})

app.post('/login', (req,res) => {
    const {body} = req
    console.log({body})

    //res.json({ body })
    res.redirect('/')
})

app.post('*', controladorDefault)

// ------------------------------------------------
//            PROCESO DE RUTAS PUT
// ------------------------------------------------
app.put('/datos', (req,res) => {
    res.send('Datos actualizados!!')
})

app.put('*', controladorDefault)

// ------------------------------------------------
//            PROCESO DE RUTAS DELETE
// ------------------------------------------------
app.delete('/datos', (req,res) => {
    res.send('Datos eliminados!!')
})

app.delete('*', controladorDefault)


const PORT = 8080
const server = app.listen(PORT, () => console.log(`Servidor Express escuchando en http://localhost:${PORT}`))
server.on('error', error => console.log(`Error en servidor: ${error.message}`))

