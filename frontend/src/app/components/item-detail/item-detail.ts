import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item';

@Component({
  selector: 'app-item-detail',
  standalone: false,
  styleUrl: './item-detail.css',
  templateUrl: './item-detail.html',
})
export class ItemDetailComponent implements OnInit {
  item?: Item;
  constructor(private route: ActivatedRoute, private svc: ItemService, private cd: ChangeDetectorRef) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.get(id).subscribe(d => { this.item = d; this.cd.markForCheck(); });
  }
}
