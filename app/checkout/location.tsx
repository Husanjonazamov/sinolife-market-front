'use client';

import { YMaps, Map, Placemark, GeolocationControl } from '@pbe/react-yandex-maps';
import { useState } from 'react';

interface CustomSearchMapProps {
  onSelect: (address: string, lat: number, long: number) => void;
}

export default function CustomSearchMap({ onSelect }: CustomSearchMapProps) {
  const [coords, setCoords] = useState<[number, number]>([41.2995, 69.2401]);
  const [address, setAddress] = useState('Toshkent, Uzbekistan');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();

      if (data.features.length > 0) {
        const [lon, lat] = data.features[0].geometry.coordinates; // float qiymatlar
        setCoords([lat, lon]);

        const foundAddress = data.features[0].properties.name + ', ' + (data.features[0].properties.city || '');
        setAddress(foundAddress);

        // float ko‘rinishda uzatyapmiz
        onSelect(foundAddress, lat, lon);
      } else {
        setAddress('Joy topilmadi');
      }
    } catch (err) {
      setAddress('Xatolik yuz berdi');
    }
  };

  const handleMapClick = async (e: any) => {
    const clickedCoords = e.get('coords');
    setCoords(clickedCoords);

    const [lat, lon] = clickedCoords;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
        headers: { 'User-Agent': 'sinolife-frontend/1.0 (info@sinolife.uz)' }
      });
      const data = await res.json();

      const foundAddress = data.display_name || 'Manzil topilmadi';
      setAddress(foundAddress);

      // float ko‘rinishda uzatyapmiz
      onSelect(foundAddress, lat, lon);
    } catch (err) {
      setAddress('Xatolik yuz berdi');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Manzil qidiring (masalan, Urganch)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button onClick={handleSearch} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Qidirish
        </button>
      </div>

      <YMaps>
        <Map
          state={{ center: coords, zoom: 12 }}
          width="100%"
          height="400px"
          onClick={handleMapClick}
        >
          <GeolocationControl options={{ float: 'left' }} />
          <Placemark geometry={coords} />
        </Map>
      </YMaps>

      <div className="p-2 bg-gray-100 rounded">
        <b>Tanlangan manzil:</b> {address}
      </div>
    </div>
  );
}
