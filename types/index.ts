export interface Table {
  id: number;
  tableNumber: number;
  capacity: number;
  locationType: "INDOOR" | "OUTDOOR";
  status: "AVAILABLE" | "BOOKED";
}

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  dpAmount: number;
  bankName: string;
  bankAccount: string;
  accountName: string;
  openTime: string;
  closeTime: string;
  closedDay: string;
  tables: Table[];
}

export interface Reservation {
  id: number;
  userId: number;
  restaurantId: number;
  tableId: number;
  reservationDate: string;
  status: string;
}