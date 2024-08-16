import React, {useState } from 'react'
import axios from 'axios'

const Otp = () => {

    const [verifyOtp, setVerifyOtp] = useState(false);
    const [formData, setFormData] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = formData
        try {
            const response = await axios.post('http://localhost:8080/api/otp/send', new URLSearchParams({ email }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            setError(response.data);
            setVerifyOtp(true)
        } catch (error) {
            console.log(error)
            setError('Error sending OTP.');
        }
        
        setFormData('')
       
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md  transition-opacity duration-300`}>
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Reset Password</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {verifyOtp ? <div className="mb-4">
                        <label htmlFor="otp" className="block text-gray-700 mb-2 font-semibold">Otp</label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData}
                            onChange={(e) => setFormData(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder='Enter received otp'
                            required
                        />
                    </div> : <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData}
                            onChange={(e) => setFormData(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder='Enter your email'
                            required
                        />
                    </div>
                    }
                    {/* {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <RiseLoader color="#30a992" margin={2} />
                        </div>
                    )} */}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-400 transition-colors"
                    >
                        {verifyOtp ? "Verify otp" : "Send Otp"}
                    </button>
                </form>

            </div>
        </div>
    )
}

export default Otp
