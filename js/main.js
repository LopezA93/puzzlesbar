/* Array productos */
let productos = [];
$.ajax({
    url: "json/productos.json",
    dataType: "json",
    success: (respuesta) => {
        productos = respuesta;
    },
});

/************************************ */
$("document").ready(function () {
    


});


// guarda local productos
const guardaLocal = (clave, valor) => {

    localStorage.setItem(clave, JSON.stringify(valor))


};

/* Adherir DOM a variables*/
let imgBar= $(`#imagenBar`);
let divForm = $(`#operaciones`);
let botonComprar = $(`#comprar`);

let total = 0




///////////////////////////////////


////////////////////////////////////









let carrito = [];

/*Creamos en el DOM el carrito */
$("#carrito").prepend(`

<h4> Carrito </h4>

<div id="itemsAgregados"> </div>
<h4 id="totalCarrito"> El total es $ <span id="precioTotal" > ${total} </span> </h4>
<div id="botonesCarrito"> 
<button type="button" class="btn btn-success mt-3" id="pagarCarrito" onClick="pagarCarrito()">Pagar</button>
<button type="button" class="btn btn-danger mt-3" id="cerrarCarrito">Cerrar</button>



</div>

`);
/*FUNCIONES CARRO*/
let btnIconoCarro = $("#iconoCarro");
let divCarrito = $("#carrito");
btnIconoCarro.click(() => {
    if (divCarrito.is(":visible")) {
        divCarrito.fadeOut();
    } else {
        divCarrito.fadeIn()
    }


    cerrarCarro();


});
/*cerramos Carrito*/
function cerrarCarro() {
    $("#cerrarCarrito").click(() => {
        $("#carrito").fadeOut();

    })
}
/*calculamos el total de la compra*/
function calcularTotal() {

    let divTotal = document.getElementById("precioTotal");
    divTotal.innerHTML = ""

    total = 0;
    carrito.forEach((item) => {

        total = total + item.precio * item.cantidad;
    })
    
    divTotal.textContent = total;


    if ($("#carrito").is(":visible")) {
        divCarrito.fadeIn();

    }






}
/* funcion al hacer click pagar carro*/
function pagarCarrito() {
    if (carrito.length == 0) {
        alert("Agregue productos en el carrito")
    } else {
        let divResultado = document.querySelector("#resultado");
        let formularioCompra = `
    <form id="formCompra" class="mx-auto">
    <label for="formControlInput" class="form-label">Nombre Completo</label>
    <input type="text"  class="form-control" id="nombreCompra"  placeholder="Ingrese su nombre" >
    <label for="formControlInput" class="form-label">Teléfono</label>
<input type="number" class="form-control" id="telefonoCompra" placeholder="Ingrese su teléfono" required>
<label for="formControlInput" class="form-label">Dirección</label>
<input  class="form-control"  placeholder="Ingrese su direccion">
<button type="button" class="btn btn-primary mt-3" id="enviarCompra" onClick="compraExitosa()">Enviar pedido</button>
</form>
    `
        divCarrito.hide()
        $("#operaciones").hide();
        $("#eleccion").hide();
        $("#opiniones").hide();
        $("#servicios").hide();
        
        divResultado.innerHTML = formularioCompra;
        $("#resultado").show();

    }




}
;
function compraExitosa() {
    let divResultado = document.querySelector("#resultado");
    let nombreCompra = $("#nombreCompra").val();
    let numeroCompra = $("#telefonoCompra").val();
    let compraRealizada = `
    <h3> Gracias ${nombreCompra}, nos comunicaremos con ud. a su numero ${numeroCompra}
    `
    divResultado.innerHTML = compraRealizada
    carrito = []
    calcularTotal()
    $("#itemsAgregados").remove()
    renderLS();
}


let renderLS = function () {
    guardaLocal(`producto`, carrito)
}

/*Agrego productos al html */

botonComprar.click(() => {
    divForm.remove();
    
    $("#eleccion").addClass("row");
    
    productos.forEach((producto) => {

        $("#eleccion").prepend(` 
        <div class="card m-4 mx-auto" style="width: 18rem;">
        <img src="${producto.img}" class="card-img-top imgBebida" alt="imgbebida">
        <div class="card-body">
          <h5 class="card-title">${producto.tipoBebida}</h5>
          <p class="card-text">Precio $ <span class="itemPrecio">${producto.precio}</span>.</p>
          <button type="button" class="btn btn-success mt-3 btnID" id="agregarCarro${producto.id}" data-id="${producto.id}">Agregar al carro</button>
        </div>
      </div>
      `)
        /*Creo funcion guardar Local Storage producto seleccionado*/
        let agregarCarro = $(`#agregarCarro${producto.id}`);




        agregarCarro.click(function (e) {
            e.preventDefault();
            agregarItemsCarro();
            renderLS();
            verLocalStore();


        })

        let verLocalStore = function () {
            let verItemsGuardados = JSON.parse(localStorage.getItem(`producto`));
            console.log(verItemsGuardados);
        }




        /*agregamos al carro los items seleccionados*/
        let agregarItemsCarro = () => {
            let newItem = {
                bebida: producto.tipoBebida,
                precio: producto.precio,
                img: producto.img,
                id: producto.id,
                cantidad: 1
            }


            $("#carrito").fadeIn();
            if (verLocalStore) {

            }

            /* sumamos cantidad al hacer click de nuevo en agregar carro del mismo producto*/
            for (i = 0; i < carrito.length; i++) {
                if (carrito[i].id === newItem.id) {
                    carrito[i].cantidad++;
                    let inputCantidad = document.getElementById(`cantidad${newItem.id}`);
                    inputCantidad.value++;
                    calcularTotal()

                    return null;
                }
            }


            carrito.push(newItem);
            agregarCarritoProducto();
            function agregarCarritoProducto() {
                $("#itemsAgregados").prepend(`<div id="carritoProd${newItem.id}" class= "items"> 
                     <img src="${newItem.img}" class="img-fluid w-25" </img> 
                     <p class="bebida"> ${newItem.bebida}</p>
                     <p> $ <span id="precioCarro${newItem.id}">${newItem.precio}</span></p>
                     <label for="cantidad">Cantidad</label>
                     <input  class="cantidadCarro" id="cantidad${newItem.id}" readonly  value=${newItem.cantidad}>
                    <button type="button" class="btn btn-success mt-3" id="sumarItem">+</button>
                    <button type="button" class="btn btn-secondary mt-3" id="restarItem">-</button>
                    <button type="button" class="btn btn-danger mt-3" id="quitarItem">x</button>
                              
                    </div>`);

                eliminarItemCarro();
                restarItem();


            }
            /* cambiamos la cantidad del carrito */
            $(`#sumarItem`).click(() => {

                for (i = 0; i < carrito.length; i++) {
                    if (carrito[i].id == newItem.id) {
                        carrito[i].cantidad++;
                        let inputCantidadval = document.getElementById(`cantidad${newItem.id}`);
                        inputCantidadval.value++;
                        console.log(carrito);
                        renderLS();
                        calcularTotal()

                        return null;
                    }
                }
            })

            function restarItem () {
                $("#restarItem").click(()=> {
                    for (i = 0; i < carrito.length; i++) {
                        if (carrito[i].id == newItem.id) {
                            if(carrito[i].cantidad>1){
                            carrito[i].cantidad--;
                            let inputCantidadval = document.getElementById(`cantidad${newItem.id}`);
                            inputCantidadval.value--;
                            console.log(carrito);
                            renderLS();
                            calcularTotal()
    
                            return null;}
                        }
                    }
                })
            }
            /* Quitamos item del carro*/
            function eliminarItemCarro() {
                $(`#quitarItem`).click(() => {

                    for (i = 0; i < carrito.length; i++) {
                        if (carrito[i].id === newItem.id) {
                            carrito.splice(i, 1)
                            console.log(carrito);
                            renderLS();
                            calcularTotal()
                            $(`#carritoProd${newItem.id}`).remove();
                            return null;

                        }
                    }

                })
            }

            cerrarCarro();
            calcularTotal()



        }
    }




    )


})

/*Productos del LS al inicio*/
function dibujarCarroLS() {
    if (JSON.parse(localStorage.getItem(`producto`))) {
        carrito = JSON.parse(localStorage.getItem(`producto`));
        
        carrito.forEach((producto) => {

            $("#itemsAgregados").prepend(`<div id="carritoProd${producto.id}" class= "items"> 
                     <img src="${producto.img}" class="img-fluid w-25" </img> 
                     <p class="bebida"> ${producto.bebida} </p> 
                     <p>$ <span id="precioCarro${producto.id}">${producto.precio}</span> </p>
                     <label for="cantidad">Cantidad</label>
                     <input  class="cantidadCarro" id="cantidad${producto.id}" readonly  value=${producto.cantidad}> 
                    
                    <button type="button" class="btn btn-success mt-3" id="sumarItem">+</button>
                    <button type="button" class="btn btn-secondary mt-3" id="restarItem">-</button>
                    <button type="button" class="btn btn-danger mt-3" id="quitarItem" >x</button>
                              
                    </div>
                    `)
                    eliminarItemCarroLS (producto);
                    sumarItemCarroLS(producto);
                    restarItem(producto);
                    calcularTotal();
                    
                }
                )
                   
                    
                    
            
                   
            

    
    
        calcularTotal();
        


    }
}
function eliminarItemCarroLS (producto){
    $(`#quitarItem`).click((e) => {
        e.target
        for (i=0; i < carrito.length; i++) {
            if (carrito[i].id == producto.id) {
                carrito.splice(i, 1)
                $(`#carritoProd${producto.id}`).remove()
                console.log(carrito);
                renderLS();
                calcularTotal()
                ;
                

            }
        }
        

    })}
function sumarItemCarroLS(producto) {
    $("#sumarItem").click((e) => {
        e.target;
        for (i = 0; i < carrito.length; i++) {
            if (carrito[i].id == producto.id) {
                carrito[i].cantidad++;
                let inputCantidadval = document.getElementById(`cantidad${producto.id}`);
                inputCantidadval.value++;
                console.log(carrito);
                renderLS();
                calcularTotal()

                return null;
            }
        }
    })
    
}
function restarItem (producto) {
    $("#restarItem").click((e)=> {
        e.target
        for (i = 0; i < carrito.length; i++) {
            if (carrito[i].id == producto.id) {
                if(carrito[i].cantidad>1){
                carrito[i].cantidad--;
                let inputCantidadval = document.getElementById(`cantidad${producto.id}`);
                inputCantidadval.value--;
                console.log(carrito);
                renderLS();
                calcularTotal()

                return null;}
            }
        }
    })
}
    
dibujarCarroLS();
    