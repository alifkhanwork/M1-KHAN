import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private url = 'https://localhost:7118/api/item'; // YOUR port
  constructor(private http: HttpClient) {}
  list() { return this.http.get<Item[]>(this.url); }
  get(id: number) { return this.http.get<Item>(`${this.url}/${id}`); }
  add(i: Partial<Item>) { return this.http.post(this.url, i, { responseType: 'text' }); }
  update(id: number, i: Partial<Item>) { return this.http.put(`${this.url}/${id}`, i, { responseType: 'text' }); }
  remove(id: number) { return this.http.delete(`${this.url}/${id}`, { responseType: 'text' }); }
}