import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item';

@Component({
  selector: 'app-item-form',
  standalone: false,
  styleUrl: './item-form.css',
  templateUrl: './item-form.html',
})
export class ItemFormComponent implements OnInit {
  form: any = { name: '', code: '', brand: '', unitPrice: 0 };
  id = 0;
  constructor(private route: ActivatedRoute, private router: Router, private svc: ItemService, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (this.id) this.svc.get(this.id).subscribe(d => { this.form = d; this.cd.markForCheck(); });
  }
  onSubmit() {
    const req = this.id ? this.svc.update(this.id, this.form) : this.svc.add(this.form);
    req.subscribe({ next: () => this.router.navigate(['/']), error: e => alert(e.error) });
  }
}
