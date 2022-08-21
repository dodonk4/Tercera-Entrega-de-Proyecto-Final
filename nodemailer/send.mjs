import { transporter } from "./index.mjs";
import { mailOptions, options2 } from "./mailOptions.mjs";
const sender2 = async (nombre)=> {
    try {
   console.log('Nombre en Send' + nombre)
     const info = await transporter.sendMail(await options2(nombre))
     console.log(info)
    } catch (error) {
     console.log(error)
    }
  
 }

const sender = async ()=> {
   try {
    const info = await transporter.sendMail(mailOptions)
    console.log(info)
   } catch (error) {
    console.log(error)
   }
 
}

export { sender, sender2 }
