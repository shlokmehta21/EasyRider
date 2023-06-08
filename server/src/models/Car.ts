interface Car {
  id?: string;
  name: string;
  model: string;
  purchasedOn: number;
  plateNo: string;
  type?: string;
  images?: Buffer[];
}

export default Car;
