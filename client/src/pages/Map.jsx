import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import urbanMap from './urbanMap';
import '../geocoder-styles.css';
import { useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function Map() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-78.9986);
	const [lat, setLat] = useState(43.5325);
	const [zoom, setZoom] = useState(7.25);

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom,
			pitch: 45,
		});
		// Add Geolocation Control
		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		});

		map.current.addControl(geolocate);

		// Set an event listener for the 'geolocate' event.
		geolocate.on('geolocate', () => {
			console.log('A geolocate event has occurred.');
		});

		// Add Mapbox Directions control
		const directions = new MapboxDirections({
			accessToken: mapboxgl.accessToken,
			unit: 'metric',
		});

		map.current.addControl(directions);

		const geoCoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			zoom: 17,
			placeholder: 'Search Address e.g. Lincoln Park',
			mapboxgl: mapboxgl,
			pitch: 45,
			flyTo: true,
		});

		map.current.addControl(geoCoder);

		map.current.on('move', () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});

		map.current.on('load', () => {
			const layers = map.current.getStyle().layers;
			// Find the index of the first symbol layer in the map style.
			let firstSymbolId;
			for (const layer of layers) {
				if (layer.type === 'symbol') {
					firstSymbolId = layer.id;
					break;
				}
			}

			map.current.addSource('urban-areas', {
				type: 'geojson',
				data: urbanMap,
			});
			map.current.addLayer(
				{
					id: 'urban-areas-fill',
					type: 'fill',
					source: 'urban-areas',
					layout: {},
					paint: {
						'fill-color': '#d49ff5',
						'fill-opacity': 0.2,
					},
				},
				firstSymbolId
			);
		});
	}, [lng, lat, zoom]);

	return (
		<div>
			<div className='sidebar'>
				Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
			</div>
			<div ref={mapContainer} className='map-container'></div>
		</div>
	);
}
