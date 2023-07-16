interface Car {
  id?: string;
  name: string;
  model: string;
  purchasedOn: number;
  plateNo: string;
  type: string;
  images: Buffer[];
  seatsAvailable: number;
}

export default Car;
