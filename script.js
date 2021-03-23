import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // below normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 }, // normal load
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  const BASE_URL = 'http://localhost:3000/products'; // make sure this is not production
  let responses = http.batch([
    [
      'GET',
      `${BASE_URL}/products`,
      null,
      { tags: { name: 'Products' } },
    ],
    [
      'GET',
      `${BASE_URL}/products/5/`,
      null,
      { tags: { name: 'Products with product_id' } },
    ],
    [
      'GET',
      `${BASE_URL}/products/5/styles`,
      null,
      { tags: { name: 'Products with styles' } },
    ],
    [
      'GET',
      `${BASE_URL}/products/5/related`,
      null,
      { tags: { name: 'Related' } },
    ],
  ]);
  sleep(1);
}