export default class DB{

    static LS = window.localStorage;
    static apiURL = "http://127.0.0.1:3000/";
    static apiKeyW = "d35c573092156d5f3633039067cb9cd3";

    static async getWeather(ciudad){
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${this.apiKeyW}`);
        return res.json();
    }
    
    static async delete(coleccion,id){
        try {
            console.log('hola')
            const res = await fetch(this.apiURL + coleccion +`/${id}`, {
                method: "DELETE"
            });

            console.log('adeu')
    
            if (res.ok) {
                console.log('eliminado');
                return true;
            }
        } catch (err) {
            console.error('Hubo un error en la solicitud:', err);
            return false;
        }
    }

    static async update(coleccion, datos, id){
        try {
            console.log('hola')
            const res = await fetch(this.apiURL + coleccion + `/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            console.log('adeu')
    
            if (res.ok) {
                console.log('eliminado');
                return true;
            }
        } catch (err) {
            console.error('Hubo un error en la solicitud:', err);
            return false;
        }
    }

    static async create(coleccion, datos) {
        try {
            const res = await fetch(this.apiURL + coleccion, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
    
            if (res.ok) {
                return true;
            } else {
                console.error('Hubo un error en la solicitud:', res.status);
                return false;
            }
        } catch (err) {
            console.error('Hubo un error en la solicitud:', err);
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