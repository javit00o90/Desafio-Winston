class UserDTO {
    constructor(user) {
        if (!user || typeof user !== 'object') {
            throw new Error('Invalid user data');
        }

        this.first_name = user.first_name || '';
        this.last_name = user.last_name || '';
        this.age = user.age || 0;
        this.email = this.hideEmail(user.email || '');
        this.role = user.role || '';
        this.cartId = this.hideCartId(user.cartId || '');
    }

    hideEmail(email) {
        if (!email) return '';
        const [prefix, domain] = email.split('@');
        const hiddenPrefix = prefix.slice(0, Math.floor(prefix.length / 2)) + '*'.repeat(Math.ceil(prefix.length / 2));
        return `${hiddenPrefix}@${domain}`;
    }

    hideCartId(cartId) {
        return '*****';
    }
}


export default UserDTO;