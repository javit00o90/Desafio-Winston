import { ticketsModel } from "../dao/models/tickets.model.js";

class TicketsService {
    async generateTicket(purchaseDetails) {
        try {
            const ticket = await ticketsModel.create(purchaseDetails);
            return ticket.toObject();
        } catch (error) {
            console.log(purchaseDetails)
            console.error('Error generating ticket:', error.message);
            throw new Error('Error generating ticket');
        }
    }
    
    async searchTicketsByEmail(email) {
        try {
            const tickets = await ticketsModel.find({ purchaser: email });
            return tickets;
        } catch (error) {
            console.error('Error searching tickets by email:', error.message);
            throw new Error('Error searching tickets by email');
        }
    }
}

export default TicketsService;