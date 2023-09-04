export default (text) => {
    switch (text) {
        case 'Artwork':
            return 'ออกแบบสื่อสิ่งพิมพ์';
        case 'Facebook Service':
            return 'บริการสื่อออนไลน์';
        case 'Website Service':
            return 'เขียนโปรแกรม';
        case 'Account Service':
            return 'บัญชี';
        case 'IT Support Service':
            return 'IT-Support';
        case 'Act of legislation Service(พรบ.)':
            return 'พ.ร.บ';
        case 'Insurance Service(ประกัน)':
            return 'ประกัน';
        default:
            return text;
    }
}