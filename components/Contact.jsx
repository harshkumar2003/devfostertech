import Image from "next/image";
import React, { useState } from "react";
import cont from "../Assets/cont.svg";
import email from "../Assets/Email.svg";
import ph from "../Assets/Phone.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    // toast.info("Sending your message...");

    const formData = new FormData(event.target);
    formData.append("access_key", "bf2a2af9-a17a-4bd4-bf45-7eb161d6f234");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("Thanks! We'll get back soon.");
        toast.success("Thanks! We'll get back soon.");
        event.target.reset();
      } else {
        setResult(data.message);
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      setResult("An error occurred");
      toast.error("An error occurred while submitting the form.");
      console.error("Error:", error);
    }
  };

  return (
    <div id="contact" className="py-10 scroll-mt-20">
      <h1 className="text-center text-[#6cddc2] pb-4">
        Connect With Dev Foster Tech
      </h1>
      <div className="bg-[#6CDDC2] rounded-2xl p-4 sm:flex sm:flex-col flex justify-between w-[80%] mx-auto">
        <div className="pt-8">
          <Image
            src={cont}
            alt="Contact illustration"
            className="sm:w-[300px] md:w-[350px] lg:w-[400px] xl:w-[450px] 2xl:w-[500px]"
          />
          <h1 className="flex gap-2 pt-4">
            <Image src={email} alt="Email icon" className="w-[25px]" />
            hello@devfostertech.com
          </h1>
          <h1 className="flex gap-2 pt-4">
            <Image src={ph} alt="Phone icon" className="w-[25px]" />
            +91-7349874794
          </h1>
        </div>
        <div className="border-b border-black border-opacity-50 my-4"></div>

        <div className="mt-4 w-[50%] sm:w-full">
          <form className="flex flex-col sm:justify-center" onSubmit={onSubmit}>
            <label htmlFor="name" className="pt-2">
              Your First Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="pb-2 border-b-2 border-black bg-transparent focus:outline-none"
            />

            <label htmlFor="last" className="pt-2">
              Your Last Name
            </label>
            <input
              type="text"
              name="last"
              className="pb-2 border-b-2 border-black bg-transparent focus:outline-none"
            />

            <label htmlFor="number" className="pt-2">
              Your Mobile No.
            </label>
            <input
              type="number"
              name="number"
              required
              className="pb-2 border-b-2 border-black bg-transparent focus:outline-none"
            />

            <label htmlFor="email" className="pt-2">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="pb-2 border-b-2 border-black bg-transparent focus:outline-none"
            />

            <label htmlFor="message" className="pt-2">
              Message
            </label>
            <textarea
              name="message"
              required
              className="pb-2 border-b-2 border-black bg-transparent focus:outline-none"
            ></textarea>

            <button
              type="submit"
              className="mt-4 bg-black text-white w-[150px] flex items-center justify-center px-6 py-3 rounded-2xl"
            >
              Send Us
            </button>
          </form>
        </div>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer />
    </div>
  );
};

export default Contact;
