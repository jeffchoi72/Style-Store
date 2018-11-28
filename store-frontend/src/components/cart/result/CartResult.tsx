import * as classNames from 'classnames/bind'
import * as React from 'react';

import * as styles from './CartResult.scss';

const cx = classNames.bind(styles);

const CartResult: React.SFC<{}> = () => {
  return (
      <div className={cx('cart-result')}>
        <div className={cx('cart-payment')}>
          <div className={cx('product-payment')}>
            <span className={cx('description')}>총 상품 금액</span>
            <span className={cx('money')}>20000원</span>
          </div>
          <div className={cx('product-shipping')}>
            <span className={cx('description')}>총 배송비</span>
            <span className={cx('money')}>2000원</span>
          </div>
          <div className={cx('separation-line')} />
          <div className={cx('all-payment')}>
            <span className={cx('description')}>총 결제 금액</span>
            <span className={cx('money')}>22000원</span>
          </div>
        </div>
        <button className={cx('purchase-btn')}>구매하기</button>
      </div>
  );
};

export default CartResult;
