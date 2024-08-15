const Ticket = import('../models/ticketModel');

// Función para crear un nuevo ticket
async function createTicket(ticketData) {
    try {
        // Generar un código único para el ticket
        ticketData.code = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const newTicket = new Ticket(ticketData);
        const savedTicket = await newTicket.save();
        return savedTicket;
    } catch (error) {
        throw new Error('Error al crear el ticket');
    }
}



module.exports = {
    createTicket
    
};
