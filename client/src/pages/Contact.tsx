import React from 'react';
import { Phone, Public, Room } from '@material-ui/icons';
import { TextField, Button } from '@material-ui/core';

const Contact = () => (
  <div>
    <div className="text-center text-2xl bg-gray-100 h-20 flex justify-center items-center">
      <p>CONTACT</p>
    </div>
    <div
      title="https://mapswebsite.net/fr"
      className="flex justify-center items-center mt-5"
    >
      <iframe
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        id="gmap_canvas"
        src="https://maps.google.com/maps?width=1000&amp;height=800&amp;hl=en&amp;q=%20France%20Lyon+(France)&amp;t=&amp;z=6&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        width="1400"
        height="800"
        frameBorder="0"
        title="maps"
      />{' '}
      <script
        type="text/javascript"
        src="https://embedmaps.com/google-maps-authorization/script.js?id=bb771388560158a9690aa7f384963baa36655a69"
      />
    </div>

    <div className="w-3/4 m-auto mt-5 flex space-x-3 h-100">
      <div className="w-1/3 bg-gray-200 flex justify-center items-center">
        <div className="space-y-10">
          <div className="flex space-x-2">
            <div className="border rounded-full border-black h-10 w-10 flex justify-center items-center hover:bg-black hover:text-white mt-1">
              <Phone />
            </div>
            <div className="font-sans">
              <p>+33 12 34 56 78</p>
              <p>+212 12 34 56 78</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="border rounded-full border-black h-10 w-10 flex justify-center items-center hover:bg-black hover:text-white mt-1">
              <Public />
            </div>
            <div className="font-sans">
              <p>walidoulderra@hotmail.fr</p>
              <a
                href="https://github.com/Mysticboi"
                className="hover:text-purple-500"
              >
                github.com/Mysticboi
              </a>
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="border rounded-full border-black h-10 w-10 flex justify-center items-center hover:bg-black hover:text-white mt-1">
              <Room />
            </div>
            <div className="font-sans">
              <p>Wamazon's Full Address</p>
              <p>France, Lyon</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-2/3 bg-gray-200 font-sans flex items-center justify-center text-lg">
        <div className="w-2/3">
          <p className="text-2xl text-gray-700 font-semibold">Get in touch</p>
          <div className="space-y-8">
            <div className="flex space-x-10">
              <TextField label="Name" required fullWidth />
              <TextField label="Email" required fullWidth />
            </div>

            <div className="w-full">
              <TextField label="Subject" required fullWidth />
            </div>

            <div className="border border-black p-2">
              <textarea
                placeholder="Your message"
                className="bg-gray-200 w-full"
              />
            </div>

            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={() => window.scrollTo(0, 0)}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
