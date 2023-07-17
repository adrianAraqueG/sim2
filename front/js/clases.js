export default class DB{

    static LS = window.localStorage;
    static apiURL = "http://127.0.0.1:3000/";
    
    static Delete(coleccion,id){
        
    }

    static Update(coleccion,id){
        console.log(coleccion, id);
    }

    static async create(coleccion, datos){
        try{
            const res = await fetch(this.apiURL+coleccion, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
    
            console.log(res.json());
            return true;

        }catch(err){
            console.error('Hubo un error: '+err);
            return false;
        }
    }

    static async get(coleccion){
        try{
            const res = await fetch(this.apiURL+coleccion, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            return res.json();

        }catch(err){
            console.error('Hubo un error: '+err);
            return false;
        }
        
    }
}