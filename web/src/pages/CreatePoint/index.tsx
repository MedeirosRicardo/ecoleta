import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';

import api from '../../services/api';
import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface State {
  code: string;
  term: string;
  description: string;
}

interface States {
  definitions: State[]
}

interface City {
  id: string;
  name: string;
}

interface Cities {
  items: City[]
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [selectedState, setSelectedState] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    })
  }, []);

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  function handleSelectedState(event: ChangeEvent<HTMLSelectElement>) {
    const state = event.target.value;
    setSelectedState(state);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  useEffect(() => {
    axios.get<States>('http://geogratis.gc.ca/services/geoname/en/codes/province.json').then(response => {
      const result = response.data.definitions.map((state: State) => (
        {
          code: state.code,
          term: state.term,
          description: state.description
        }
      ));
      const sortedStates = result.splice(0, 13).sort((a: State, b: State) => a.description > b.description ? 1 : -1);
      setStates(sortedStates);
    });
  }, []);

  useEffect(() => {
    if (selectedState === '0') return;
    axios.get<Cities>(`http://geogratis.gc.ca/services/geoname/en/geonames.json?province=${selectedState}&concise=CITY&concise=TOWN&concise=UNP`).then(response => {
      const cityNames = response.data.items.map((city: City) => (
        {
          id: city.id,
          name: city.name
        }
      ));
      const sortedCities = cityNames.sort((a: City, b: City) => a.name > b.name ? 1 : -1);
      setCities(sortedCities);
    });
  }, [selectedState]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, phone} = formData;
    const state = selectedState[0];
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

      data.append('name', name);
      data.append('email', email);
      data.append('phone', phone);
      data.append('state', state);
      data.append('city', city);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('items', items.join(','));
      
      if (selectedFile) {
        data.append('image', selectedFile);
      }

    await api.post('points', data);

    alert('Point of Collection registered!');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eRecycle" />

        <Link to="/">
          <FiArrowLeft />
                    Back to Home
                </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Point of Collection Registration</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

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
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select address on map</span>
          </legend>

          <Map center={initialPosition} zoom={14} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">Province</label>
              <select
                name="state"
                id="state"
                value={selectedState}
                onChange={handleSelectedState}
              >
                <option value="0">Select a Province</option>
                {states.map(state => (
                  <option key={state.code} value={[state.code, state.term]}>{state.description}</option>
                ))}


              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select
                name="city" 
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
              >
                <option value="0">Select a City</option>
                {cities.map(city => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))}
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
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
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