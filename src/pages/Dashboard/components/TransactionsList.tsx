import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Film,
  Coffee,
  Car,
  Zap,
  ShoppingBag,
  Utensils,
} from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { ListRowSkeleton } from '@/components/shared/Skeleton';
import type { RootState } from '@/store';
import { SortBy } from '@/types/api';
import type { Transaction } from '@/types/api';

const iconMap: Record<string, typeof ShoppingCart> = {
  'shopping-cart': ShoppingCart,
  film: Film,
  coffee: Coffee,
  car: Car,
  zap: Zap,
  'shopping-bag': ShoppingBag,
  utensils: Utensils,
};

const categories = [
  'All',
  'Groceries',
  'Entertainment',
  'Transportation',
  'Dining',
  'Shopping',
  'Utilities',
];

const sortOptions = [
  { value: SortBy.DateDesc, label: 'Newest First' },
  { value: SortBy.DateAsc, label: 'Oldest First' },
  { value: SortBy.AmountDesc, label: 'Highest Amount' },
  { value: SortBy.AmountAsc, label: 'Lowest Amount' },
];

const ITEMS_PER_PAGE = 5;

export default function TransactionsList() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.DateDesc);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const checkOverflow = useCallback(() => {
    if (scrollContainerRef.current) {
      setShowArrows(
        scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth,
      );
    }
  }, []);

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [checkOverflow]);

  const customerId = useSelector((state: RootState) => state.filters.customerId);

  const { data, isFetching } = useTransactions(customerId, {
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
    category: selectedCategory !== 'All' ? selectedCategory : null,
    sortBy,
  });

  const transactions: Transaction[] = data?.transactions ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    limit: ITEMS_PER_PAGE,
    offset: 0,
    hasMore: false,
  };

  const currentTransactions = searchQuery
    ? transactions.filter(txn => {
        const query = searchQuery.toLowerCase();
        return (
          txn.merchant.toLowerCase().includes(query) ||
          txn.description.toLowerCase().includes(query) ||
          txn.category.toLowerCase().includes(query)
        );
      })
    : transactions;

  const totalPages = Math.ceil(pagination.total / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort as SortBy);
    setCurrentPage(1);
  };

  return (
    <div className="transactions-list">
      <div className="transactions-list__card">
        <div className="transactions-list__header">
          <h2 className="transactions-list__title">Transactions</h2>

          <div className="transactions-list__search-wrapper">
            <Search className="transactions-list__search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="transactions-list__search-input"
            />
          </div>

          <div className="transactions-list__categories-wrapper">
            {showArrows && (
              <button
                onClick={() => scrollCategories('left')}
                className="transactions-list__scroll-btn transactions-list__scroll-btn--left"
              >
                <ChevronLeft />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className={`transactions-list__categories-scroll ${showArrows ? 'transactions-list__categories-scroll--padded' : ''}`}
            >
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`transactions-list__category-pill ${
                    selectedCategory === category
                      ? 'transactions-list__category-pill--active'
                      : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {showArrows && (
              <button
                onClick={() => scrollCategories('right')}
                className="transactions-list__scroll-btn transactions-list__scroll-btn--right"
              >
                <ChevronRight />
              </button>
            )}
          </div>

          <div className="transactions-list__sort-bar">
            <Filter />
            <select
              value={sortBy}
              onChange={e => handleSortChange(e.target.value)}
              className="transactions-list__sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="transactions-list__total-count">
              {pagination.total} total
            </span>
          </div>
        </div>

        <div className="transactions-list__rows">
          {isFetching ? (
            <ListRowSkeleton count={ITEMS_PER_PAGE} />
          ) : currentTransactions.length === 0 ? (
            <div className="transactions-list__empty">
              <p>No transactions found</p>
            </div>
          ) : (
            currentTransactions.map(transaction => {
              const Icon = iconMap[transaction.icon] || ShoppingCart;

              return (
                <div key={transaction.id} className="transactions-list__row">
                  <div
                    className="transactions-list__row-icon"
                    style={{ backgroundColor: `#f1f1f1` }}
                  >
                    <Icon style={{ color: '#333' }} />
                  </div>

                  <div className="transactions-list__row-content">
                    <div className="transactions-list__row-main">
                      <div className="transactions-list__row-details">
                        <p className="transactions-list__merchant">
                          {transaction.merchant}
                        </p>
                        <p className="transactions-list__description">
                          {transaction.description}
                        </p>
                        <div className="transactions-list__row-meta">
                          <span className="transactions-list__datetime">
                            {formatDate(transaction.date)} •{' '}
                            {formatTime(transaction.date)}
                          </span>
                          <span
                            className="transactions-list__category-badge"
                            style={{
                              color: transaction.categoryColor,
                            }}
                          >
                            {transaction.category}
                          </span>
                        </div>
                      </div>

                      <div className="transactions-list__row-amount">
                        <p className="transactions-list__amount">
                          -R{transaction.amount.toFixed(2)}
                        </p>
                        <p className="transactions-list__payment-method">
                          {transaction.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {pagination.total > 0 && (
          <div className="transactions-list__pagination">
            <div className="transactions-list__pagination-inner">
              <div className="transactions-list__pagination-info">
                Showing {startIndex + 1}-
                {Math.min(startIndex + currentTransactions.length, pagination.total)} of{' '}
                {pagination.total}
              </div>

              <div className="transactions-list__pagination-controls">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="transactions-list__pagination-arrow"
                >
                  <ChevronLeft />
                </button>

                <div className="transactions-list__page-numbers">
                  {getVisiblePages().map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`transactions-list__page-btn ${
                        currentPage === page ? 'transactions-list__page-btn--active' : ''
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="transactions-list__pagination-arrow"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
