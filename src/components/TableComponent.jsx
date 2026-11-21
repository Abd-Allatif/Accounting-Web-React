import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

export const Table = React.forwardRef(({ className, ...props }, ref) => (
  <TableWrapper>
    <div className="table-scroll">
      <table ref={ref} className={classNames('DataTable', className)} {...props} />
    </div>
  </TableWrapper>
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={classNames('DataThead', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={classNames('DataTbody', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={classNames('DataTfoot', className)} {...props} />
));
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={classNames('DataTr', className)} {...props} />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th ref={ref} className={classNames('DataTh', className)} {...props} />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={classNames('DataTd', className)} {...props} />
));
TableCell.displayName = 'TableCell';

export const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption ref={ref} className={classNames('DataCaption', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';

const TableWrapper = styled.div`
  .table-scroll {
    width: 100%;
    overflow-x: auto;
    &::-webkit-scrollbar { height: 5px; }
    &::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 99px; }
  }

  .DataTable {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.865rem;
    color: var(--text-primary, #e8e8ff);
  }

  .DataThead .DataTr {
    background: linear-gradient(90deg, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.06) 100%);
  }

  .DataTh {
    padding: 0.85em 1em;
    text-align: center;
    font-weight: 600;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-accent, #818cf8);
    border-bottom: 1px solid var(--border, rgba(99,102,241,0.12));
    white-space: nowrap;
  }

  .DataTbody .DataTr {
    border-bottom: 1px solid rgba(99,102,241,0.07);
    transition: background var(--transition-fast, 150ms);

    &:last-child { border-bottom: none; }

    &:nth-child(even) {
      background: rgba(99,102,241,0.03);
    }

    &:hover {
      background: rgba(99,102,241,0.08);
    }
  }

  .DataTd {
    padding: 0.7em 0.75em;
    text-align: center;
    vertical-align: middle;
    color: var(--text-primary, #e8e8ff);
    max-width: 200px;
  }

  .DataCaption {
    margin-top: 0.5em;
    font-size: 0.8rem;
    color: var(--text-muted, rgba(232,232,255,0.3));
    text-align: center;
  }

  .DataTfoot .DataTr {
    background: rgba(99,102,241,0.05);
    font-weight: 600;
  }
`;
