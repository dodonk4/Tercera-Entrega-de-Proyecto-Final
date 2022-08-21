import twilio from 'twilio'
const accountSid = 'ACac54c864b295554403732ac986dfdc27'
const authToken = '0e220bd8ebff6d10e9b5ada070b2dc8f'
const client = twilio(accountSid, authToken)
try {
    const message = await client.messages.create({
        body: 'Hola soy un SMS desde Node.js!',
        from: '+15138484072',
        to: '+542235198563'
    })
    console.log(message)
} catch (error) {
    console.log(error)
}