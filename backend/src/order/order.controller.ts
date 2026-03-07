import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST /api/afisha/order
  @Post()
  createOrder(@Body() dto: CreateOrderDTO) {
    return this.orderService.createOrder(dto);
  }
}
