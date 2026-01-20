package org.xumin.petcare.web.common;

import java.util.List;

public class PageResponse<T> {
    private List<T> items;
    private PageMeta page;

    public PageResponse() {
    }

    public PageResponse(List<T> items, PageMeta page) {
        this.items = items;
        this.page = page;
    }

    public List<T> getItems() {
        return items;
    }

    public void setItems(List<T> items) {
        this.items = items;
    }

    public PageMeta getPage() {
        return page;
    }

    public void setPage(PageMeta page) {
        this.page = page;
    }

    public static class PageMeta {
        private int number;
        private int size;
        private long totalElements;
        private int totalPages;

        public PageMeta() {
        }

        public PageMeta(int number, int size, long totalElements, int totalPages) {
            this.number = number;
            this.size = size;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
        }

        public int getNumber() {
            return number;
        }

        public void setNumber(int number) {
            this.number = number;
        }

        public int getSize() {
            return size;
        }

        public void setSize(int size) {
            this.size = size;
        }

        public long getTotalElements() {
            return totalElements;
        }

        public void setTotalElements(long totalElements) {
            this.totalElements = totalElements;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public void setTotalPages(int totalPages) {
            this.totalPages = totalPages;
        }
    }

    @Override
    public String toString() {
        return "PageResponse{" +
                "items=" + items +
                ", page=" + page +
                '}';
    }
}