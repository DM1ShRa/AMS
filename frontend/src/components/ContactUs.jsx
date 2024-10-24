import React from "react";

const ContactUs = () => {
  return (
    <div className="grid sm:grid-cols-2 items-start gap-16 p-4 mx-auto max-w-4xl bg-white font-[sans-serif]">
      <div>
        <h1 className="text-gray-800 text-3xl font-extrabold">Let's Talk</h1>
        <p className="text-sm text-gray-500 mt-4">
          Have some big idea or brand to develop and need help? Then reach out we'd love to hear about your project and provide help.
        </p>

        <div className="mt-12">
          <h2 className="text-gray-800 text-base font-bold">Email</h2>
          <ul className="mt-4">
            <li className="flex items-center">
              <div className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="gray-800" viewBox="0 0 512 512">
  <path d="M502.3 190.8L327.4 335.1c-19.4 16.1-48.5 16.1-67.9 0L9.7 190.8C3.8 185.5 0 177.9 0 170v272c0 30.9 25.1 56 56 56h400c30.9 0 56-25.1 56-56V170c0-7.9-3.8-15.5-9.7-19.2zm-266.6 86.5c13.6 11.3 33.1 11.3 46.7 0L456 215v237H56V215l179.7 147.3zM56 128h400c30.9 0 56 25.1 56 56v6L269.4 326.3c-6.8 5.6-16.9 5.6-23.7 0L0 190v-6c0-30.9 25.1-56 56-56z"/>
</svg>

              </div>
              <a href="mailto:heyyabhishekjadhav@gmail.com" className="text-gray-800 text-sm ml-4">
                <small className="block">Mail</small>
                <strong>authority@gamail.com</strong>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-gray-800 text-base font-bold">Socials</h2>
          <ul className="flex mt-4 space-x-4">
            

<li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="gray-800" viewBox="0 0 24 24">
      <path d="M22.675 0H1.325C.595 0 0 .595 0 1.325v21.351C0 23.405.595 24 1.325 24H12.82v-9.294H9.692V11.07h3.128V8.413c0-3.1 1.894-4.788 4.662-4.788 1.325 0 2.463.099 2.795.143v3.243H18.93c-1.5 0-1.792.713-1.792 1.76v2.307h3.587l-.467 3.635h-3.12V24h6.116c.729 0 1.325-.596 1.325-1.324V1.325C24 .595 23.405 0 22.675 0z"/>
    </svg>
  </a>
</li>

<li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="gray-800" viewBox="0 0 24 24">
      <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.609 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.897-.957-2.178-1.555-3.594-1.555-2.722 0-4.928 2.205-4.928 4.928 0 .386.044.763.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.423.729-.666 1.577-.666 2.476 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.062c0 2.385 1.698 4.374 3.95 4.828-.413.111-.849.171-1.296.171-.317 0-.626-.031-.928-.088.631 1.963 2.445 3.393 4.6 3.433-1.68 1.316-3.809 2.101-6.115 2.101-.398 0-.79-.023-1.175-.069C2.18 20.292 4.777 21 7.548 21c9.057 0 14.01-7.508 14.01-14.01 0-.214-.004-.428-.013-.64.964-.695 1.8-1.562 2.462-2.549z"/>
    </svg>
  </a>
</li>

<li className="bg-[#e6e6e6cf] h-10 w-10 rounded-full flex items-center justify-center shrink-0">
  <a href="https://reddit.com" target="_blank" rel="noopener noreferrer">
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="gray-800" viewBox="0 0 24 24">
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.529 3.751 10.132 8.843 11.431-.122-.435-.232-.877-.311-1.327-.222-1.202-.537-2.92-.787-4.05l-.18-.825c-.334-1.527-1.086-3.297-1.086-4.745 0-2.222 1.502-4.037 3.854-4.794l.318-.097c.135-.301.202-.678.171-1.112-.122-1.779-.669-2.722-1.518-3.523 1.224-.455 2.794-.504 4.319-.17 1.083.243 2.082.764 2.778 1.534.248.247.496.521.732.792.278-.326.635-.68 1.054-1.033C17.747 4.732 14.859 4 12 4 6.477 4 2 8.477 2 14c0 4.418 3.582 8 8 8s8-3.582 8-8z"/>
    </svg>
  </a>
</li>

            {/* Other social icons */}
          </ul>
        </div>
      </div>

      

      <form className="ml-auto space-y-4">
        <input type="text" placeholder="Name" className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-800 text-sm outline-blue-500 focus:bg-transparent" />
        <input type="email" placeholder="Email" className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-800 text-sm outline-blue-500 focus:bg-transparent" />
        <input type="text" placeholder="Subject" className="w-full rounded-md py-3 px-4 bg-gray-100 text-gray-800 text-sm outline-blue-500 focus:bg-transparent" />
        <textarea placeholder="Message" rows="6" className="w-full rounded-md px-4 bg-gray-100 text-gray-800 text-sm pt-3 outline-blue-500 focus:bg-transparent"></textarea>
        <button type="button" className="text-white bg-gray-600 hover:bg-gray-900 tracking-wide rounded-md text-sm px-4 py-3 w-full !mt-6">
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
