import React, { useState, useEffect } from 'react'
import { DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { IGoods, ICategories, AddEditBarangProps } from '@/types/ksharia.interface'

export default function AddEditBarang({ isOpen, onOpenChange, barang, onSubmit }: AddEditBarangProps) {
  const [formData, setFormData] = useState<Partial<IGoods>>({
    name: barang?.name || '',
    description: barang?.description || '',
    price: barang?.price || 0,
    stock: barang?.stock || 0,
    category_id: barang?.category_id || '',
  });
  const [categories, setCategories] = useState<ICategories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (barang) {
      setFormData({
        name: barang.name || '',
        description: barang.description || '',
        price: barang.price || 0,
        stock: barang.stock || 0,
        category_id: barang.category_id || '',
      });
    }
  }, [barang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category_id: '',
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{barang ? 'Edit Barang' : 'Tambah Barang'}</DialogTitle>
          <DialogDescription>
            {barang ? 'Edit informasi barang yang ada' : 'Tambahkan barang baru ke dalam sistem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Barang</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => {
                const selectedCategory = categories.find(c => c.id === value);
                if (selectedCategory) {
                  setFormData({ ...formData, category_id: selectedCategory.id });
                }
              }}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Harga</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" className='hover:cursor-pointer' onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" className='hover:cursor-pointer'>
              {barang ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
