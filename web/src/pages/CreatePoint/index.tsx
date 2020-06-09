import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface State {
  term: string;
  description: string;
}

interface States extends Array<State> {
  [x: string]: any;
  definitions: any;
}


const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<States[]>([]);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get<States>('http://geogratis.gc.ca/services/geoname/en/codes/province.json').then(response => {
      const result = response.data.definitions.map((state: { term: any; description: any; }) => (
        {
          term: state.term,
          description: state.description
        }
      ));
      const sorted = result.splice(0,13).sort((a: States, b: States) => a.description > b.description ? 1 : -1);
      setStates(sorted);
    });
  }, []);
  
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eRecycle" />

        <Link to="/">
          <FiArrowLeft />
                    Back to Home
                </Link>
      </header>

      <form>
        <h1>Register a Point of Collection</h1>

        <fieldset>
          <legend>
            <h2>Info</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select address on map</span>
          </legend>

          <Map center={[43.6532, -79.3832]} zoom={12}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[43.6532, -79.3832]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Province</label>
              <select name="state" id="state">
                <option value="0">Select a Province</option>
                {states.map(state => (
                  <option key={state.term} value={state.term}>{state.description}</option>
                ))}
                

              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select name="city" id="city">
                <option value="0">Select a City</option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Collected items</h2>
            <span>Select one or more items</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Register Point</button>
      </form>
    </div>
  );
};

export default CreatePoint;