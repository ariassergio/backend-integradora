import Product from '../models/Product';
import User from '../models/User';
import nodemailer from 'nodemailer';

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const user = await User.findById(product.owner);

        await Product.findByIdAndDelete(productId);

        if (user && user.role === 'premium') {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'tu-email@gmail.com',
                    pass: 'tu-contraseña'
                }
            });

            const mailOptions = {
                from: 'tu-email@gmail.com',
                to: user.email,
                subject: 'Producto eliminado',
                text: `Estimado ${user.first_name}, su producto "${product.name}" ha sido eliminado.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error al enviar correo:', error);
                } else {
                    console.log('Correo enviado:', info.response);
                }
            });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
