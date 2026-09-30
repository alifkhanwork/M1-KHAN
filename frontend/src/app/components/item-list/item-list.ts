import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item';
import { TokenStorageService } from '../../services/token-storage';

@Component({
  selector: 'app-item-list',
  standalone: false,
  styleUrl: './item-list.css',
  templateUrl: './item-list.html',
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  search = '';
  brand = '';
  brands = ['Nintendo', 'Sega', 'Sony', 'Atari'];
  layout: 'slots' | 'sheet' = 'slots';
  selected: Item | null = null;

  checked = false;
  apiOk = false;
  dbOk = false;
  apiLabel = 'API: CHECKING';
  dbLabel = 'DB: CHECKING';

  modal: 'form' | 'delete' | null = null;
  editingId = 0;
  form = { name: '', code: '', brand: 'Nintendo', unitPrice: 0 };
  formError = '';
  pendingDelete: Item | null = null;
  loginNotice = false;
  loginMessage = '';
  loginCountdown = 3;
  private loginTimer?: ReturnType<typeof setInterval>;

  constructor(
    private svc: ItemService,
    private cd: ChangeDetectorRef,
    private token: TokenStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.clearLoginTimer();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modal) this.closeModal();
  }

  get stockCount(): number {
    return this.items.length;
  }

  get valuation(): number {
    return this.items.reduce((sum, item) => sum + Number(item.unitPrice || 0), 0);
  }

  get brandOptions(): string[] {
    if (this.form.brand && !this.brands.includes(this.form.brand)) {
      return [...this.brands, this.form.brand];
    }
    return this.brands;
  }

  get filtered(): Item[] {
    const query = this.search.toLowerCase();
    return this.items.filter((item) => {
      const brandOk = !this.brand || item.brand === this.brand;
      const textOk =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query);
      return brandOk && textOk;
    });
  }

  trackId(_index: number, item: Item): number {
    return item.id;
  }

  load(): void {
    const started = performance.now();
    this.svc.list().subscribe({
      next: (data) => {
        const ms = Math.max(1, Math.round(performance.now() - started));
        this.items = data;
        this.checked = true;
        this.apiOk = true;
        this.dbOk = true;
        this.apiLabel = 'API: ONLINE | 200 OK';
        this.dbLabel = `DB: CONNECTED | ${ms}ms`;
        if (this.selected) {
          this.selected = data.find((item) => item.id === this.selected!.id) ?? null;
        }
        this.cd.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.checked = true;
        this.apiOk = false;
        this.dbOk = false;
        this.apiLabel = `API: OFFLINE | ${error.status || 'ERR'}`;
        this.dbLabel = 'DB: DISCONNECTED';
        this.cd.markForCheck();
      },
    });
  }

  select(item: Item): void {
    this.selected = item;
  }

  setBrand(brand: string): void {
    this.brand = brand;
  }

  openAdd(): void {
    if (!this.requireLogin('add')) return;
    this.editingId = 0;
    this.form = { name: '', code: '', brand: 'Nintendo', unitPrice: 0 };
    this.formError = '';
    this.modal = 'form';
  }

  openEdit(item: Item): void {
    if (!this.requireLogin('edit')) return;
    this.editingId = item.id;
    this.form = {
      name: item.name,
      code: item.code,
      brand: item.brand,
      unitPrice: item.unitPrice,
    };
    this.formError = '';
    this.modal = 'form';
  }

  save(): void {
    const payload = { ...this.form, unitPrice: Number(this.form.unitPrice) };
    const request = this.editingId
      ? this.svc.update(this.editingId, payload)
      : this.svc.add(payload);
    request.subscribe({
      next: () => {
        this.modal = null;
        this.cd.markForCheck();
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.formError = typeof error.error === 'string' ? error.error : 'Save failed.';
        this.cd.markForCheck();
      },
    });
  }

  askDelete(item: Item): void {
    if (!this.requireLogin('delete')) return;
    this.pendingDelete = item;
    this.modal = 'delete';
  }

  confirmDelete(): void {
    if (!this.pendingDelete) return;
    const id = this.pendingDelete.id;
    this.svc.remove(id).subscribe({
      next: () => {
        if (this.selected?.id === id) this.selected = null;
        this.modal = null;
        this.pendingDelete = null;
        this.cd.markForCheck();
        this.load();
      },
      error: () => {
        this.modal = null;
        this.cd.markForCheck();
      },
    });
  }

  closeModal(): void {
    this.modal = null;
    this.pendingDelete = null;
    this.formError = '';
  }

  private requireLogin(action: 'add' | 'edit' | 'delete'): boolean {
    if (this.token.isLoggedIn()) return true;
    const message = {
      add: 'YOU MUST LOG IN BEFORE ADDING AN ITEM.',
      edit: 'YOU MUST LOG IN BEFORE EDITING AN ITEM.',
      delete: 'YOU MUST LOG IN BEFORE DELETING AN ITEM.',
    }[action];
    this.showLoginAlert(message);
    return false;
  }

  private showLoginAlert(message: string): void {
    if (this.loginNotice) return;
    this.loginNotice = true;
    this.loginMessage = message;
    this.loginCountdown = 3;
    this.cd.markForCheck();
    this.loginTimer = setInterval(() => {
      this.loginCountdown -= 1;
      if (this.loginCountdown <= 0) {
        this.clearLoginTimer();
        this.router.navigate(['/login']);
      }
      this.cd.markForCheck();
    }, 1000);
  }

  private clearLoginTimer(): void {
    if (!this.loginTimer) return;
    clearInterval(this.loginTimer);
    this.loginTimer = undefined;
  }
}
