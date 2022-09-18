const express = require("express")

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = 8080

const server = app.listen(PORT, () => {
    console.log(`escuchando puerto ${PORT}`)
})

app.use(express.static("./index.html" + '/'));

app.get("/api/productos", (req, res) => {
    res.send(contenedor.getAll())
})

app.get("/api/productos/:id", (req, res) => {
    const {id} = req.params
    res.send(contenedor.getById(id))
})

app.post('/api/productos/post', (req, res) => {
    const producto = req.body
    contenedor.save(producto)
    res.send(console.log(producto.id))
})

app.put("/api/productos/put/:id", (req, res) => {
    const id = req.params
    const producto = req.body
    contenedor.deleteById(id)
    res.send(contenedor.update(producto, id))
})

app.delete("/api/productos/delete/:id", (req, res) => {
    const {id} = req.params
    contenedor.deleteById(id)
    res.send(console.log(`prodcuto ${id} eliminado`))
})


const fs = require('fs')

class Contenedor {
    constructor(fileName) {
        try {
            this.fileName = fileName,
            this.products = JSON.parse(fs.readFileSync(fileName, "utf-8"))
        } catch (e) {
            fs.writeFileSync(fileName, JSON.stringify([]));
            this.products = [];
        }
    }

    update(producto, id){
        producto.id = id;
        this.products.push(producto);
        
        return fs.promises.writeFile(this.fileName, JSON.stringify(this.products))
        .then(() => { return id})
        .catch((err) => { return err})
    }

    save(product) {
        let id = this.products.length > 0 ? this.products[this.products.length-1].id + 1 : 1;
        product.id = id;
        this.products.push(product);

        return fs.promises.writeFile(this.fileName, JSON.stringify(this.products))
        .then(() => { return id})
        .catch((err) => { return err})
    }

    getById(id) {
        let product = this.products.find(product => product.id == id);
        if (product === undefined) {
            return null;
        } else {
            return product;
        }
    }

    getAll() {
        return this.products
    }

    deleteById(id) {
        if (this.products.some(product => product.id == id)) {
            let newList = this.products
            const result = newList.filter(product => product.id !== id);
            this.products = result;
            return fs.promises.writeFile(this.fileName, JSON.stringify(result))
            .then(() => {return `Item borrado con exito`})
            .catch((err) => { return err})
        } else {
            return "Item inexistente";
        }
    }

     deleteAll() {
        return fs.promises.writeFile(this.fileName, JSON.stringify([]), (err) => {
            if (err) { 
                return err
            }
        }).then(() => {
            return []
        })
    }
}

const contenedor = new Contenedor('./productos.txt');