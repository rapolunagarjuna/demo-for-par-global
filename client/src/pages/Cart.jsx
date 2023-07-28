
import BlueBtn from "../components/BlueBtn";
import NavBarMain from "../components/NavBarMain";
import Footer from "../components/Footer";


export default function Cart () {

    
    const cart = [
        {title: 'Product 1', dimensions: 'dimension1 x dimension2', price: 100, quantity: 1, productCode: 'product1'},
        {title: 'Product 2', dimensions: 'dimension1 x dimension2', price: 200, quantity: 2, productCode: 'product2'},
        {title: 'Product 3', dimensions: 'dimension1 x dimension2', price: 300, quantity: 3, productCode: 'product3'}
    ]

    

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            <NavBarMain />
            
            <div className="m-auto w-6/12">
                <p className="mb-10 text-center text-5xl">Your Cart</p>
                <table className="w-full border-collapse text-primary border border-primary text-center text-xl">
                    <thead className="font-bold text-2xl">
                        <tr className="bg-secondary">
                            <th className="border border-primary p-5">S.No</th>
                            <th className="border border-primary p-5">Product</th>
                            <th className="border border-primary p-5">Dimensions</th>
                            <th className="border border-primary p-5">Quantity</th>
                            <th className="border border-primary p-5">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="border border-primary p-5">{index + 1}</td>
                                <td className="border border-primary p-5">{item.title}</td>
                                <td className="border border-primary p-5">{item.dimensions}</td>
                                <td className="border border-primary p-5">{item.quantity}</td>
                                <td className="border border-primary p-5">{item.price}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="4" className="text-right p-5 border-primary border-r">Total</td>
                            <td className="flex flex-row p-5">
                                <span>$</span>
                                <p className="w-full text-center">{cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="mt-8 flex flex-row justify-end">
                    <BlueBtn name="Checkout" func={()=>console.log(cart)}/>
                </div>
            </div>                
            <Footer />
        </div>
    );
}