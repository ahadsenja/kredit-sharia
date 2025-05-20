'use client'

import React, { useEffect, useState } from 'react'
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusIcon } from 'lucide-react';
import type { IGoods, IGoodsGridPagination, AddEditBarangProps } from '@/types/ksharia.interface';
import ContentHeader from '@/components/content-header';
import AddEditBarang from './add-edit-barang'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export default function GoodsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const [goods, setGoods] = useState<IGoodsGridPagination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<IGoods>();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const response = await fetch(`/api/goods?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGoods(data.data || []);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching goods:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch goods');
      }
    }
    fetchGoods();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
          size="default"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate start and end of visible pages
    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust if we're near the start
    if (currentPage <= halfVisible + 1) {
      endPage = Math.min(totalPages - 1, maxVisiblePages);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfVisible) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            size="default"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            size="default"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const handleAddEdit = async (data: Partial<IGoods>) => {
    try {
      const url = selectedBarang 
        ? `/api/goods/${selectedBarang.id}`
        : '/api/goods';
      
      const method = selectedBarang ? 'PUT' : 'POST';
      
      console.log('Sending data to API:', data);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Refresh the goods list
      const currentResponse = await fetch(`/api/goods?page=${currentPage}&limit=${itemsPerPage}`);
      const currentData = await currentResponse.json();
      setGoods(currentData.data || []);
      setTotalPages(currentData.totalPages || 1);
    } catch (err) {
      console.error('Error saving goods:', err);
      setError(err instanceof Error ? err.message : 'Failed to save goods');
    }
  };

  const handleEdit = (barang: IGoodsGridPagination) => {
    setSelectedBarang({
      ...barang,
      category_id: barang.categories.id
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedBarang(undefined);
    setIsDialogOpen(true);
  };

  return (
    <>
      <ContentHeader 
        title="Barang" 
        button={
          <Button variant="outline" onClick={handleAdd} className='flex items-center gap-2 hover:cursor-pointer'>
            <PlusIcon /> Tambah
          </Button>
        } 
      />

      <AddEditBarang
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        barang={selectedBarang}
        onSubmit={handleAddEdit}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goods.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item?.name}</TableCell>
              <TableCell>{item?.description}</TableCell>
              <TableCell>{item?.categories?.name}</TableCell>
              <TableCell>Rp {item?.price?.toLocaleString()}</TableCell>
              <TableCell>{item?.stock}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination className='flex items-center justify-end space-x-2 py-4'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                size="default"
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                size="default"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
