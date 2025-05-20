'use client'

import React, { useEffect, useState } from 'react'
import type { ICategories } from '@/types/ksharia.interface';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export default function CategoriesPage() {
   const [categories, setCategories] = useState<ICategories[]>([]);
   const [error, setError] = useState<string | null>(null);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [totalPages, setTotalPages] = useState<number>(1);
   const itemsPerPage = 10;

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.data || []);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      }
    }
    fetchCategories();
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kategori</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <Table className='w-full border-accent-foreground'>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
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
                size="sm"
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                size="sm"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
