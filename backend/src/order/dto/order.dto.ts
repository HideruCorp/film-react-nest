export class TicketDTO {
  film: string; // UUID фильма
  session: string; // UUID сеанса
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDTO {
  email: string;
  phone: string;
  tickets: TicketDTO[];
}

export class OrderResponseItemDTO extends TicketDTO {
  id: string; // UUID созданного заказа
}

export class CreateOrderResponseDTO {
  total: number;
  items: OrderResponseItemDTO[];
}
