import { Context } from "koa";
import { saveCartValidation } from "../lib/validation/cartValidation";
import { Repository, getManager } from "typeorm";
import Goods from "../database/model/Goods";
import Options from "../database/model/Options";
import Cart from "../database/model/Cart";
import User from "../database/model/User";

interface AuthContext extends Context {
  token?: {
    userEmail: string;
    nickName: string;
    iat: Date;
    exp: Date;
    iss: string;
    sub: string;
  }
};

const getCarts = (ctx: Context) => {
  ctx.status = 200;
  ctx.body = 'getCarts';
};

const saveCart = async (ctx: AuthContext) => {
  try {
    type BodySchema = {
      goodsId?: number; // 제품 아이디
      optionsId?: number; // 옵션 아이디
      quantity?: number; // 옷 수량
    };

    const { userEmail } = ctx.token;

    const isValid = saveCartValidation(ctx.request.body);
    if (isValid.error) {
      ctx.status = 400;
      ctx.body = {
        name: 'WRONG_SCHEMA',
        description: '요청 파라미터 에러',
      };
      return;
    }

    const { goodsId, optionsId, quantity }: BodySchema = ctx.request.body;

    const userRepository:Repository<User> = getManager().getRepository(User);
    const cartRepository:Repository<Cart> = getManager().getRepository(Cart);
    const goodsRepository:Repository<Goods> = getManager().getRepository(Goods);
    const optionsRepository:Repository<Options> = getManager().getRepository(Options);

    const user = await userRepository.findOne({ where: { userEmail }});
    const goods = await goodsRepository.findOne({ where: { id: goodsId }});
    const options = await optionsRepository.findOne({ where: { id: optionsId }});

    if (!goods || !options) {
      ctx.status = 406;
      ctx.body = {
        name: 'NOT_EXISTS',
        description: '상품이 존재하지 않습니다',
      };
      return;
    }

    const cartBuild: Cart = new Cart();
    cartBuild.quantity = quantity;
    cartBuild.goods = goods;
    cartBuild.options = options;
    cartBuild.user = user;

    await cartRepository.save(cartBuild);

    const cartCount = await cartRepository.count({ where: { user }});

    ctx.status = 200;
    ctx.body = {
      name: 'SUCCESS',
      description: '장바구니 추가 완료',
      data: {
        cartCount,
      }
    };
  } catch (error) {
    console.error(`SERVER ERROR: ${error.message}`);
    ctx.status = 500;
    ctx.body = {
      name: 'SERVER_ERROR',
      description: '서버 에러'
    };
  }
};

const removeCart = async (ctx: AuthContext) => {
  ctx.status = 200;
  ctx.body = 'removeCart';
};

const getCartCount = async (ctx: AuthContext) => {
  try {
    const { userEmail } = ctx.token;

    const cartRepository:Repository<Cart> = getManager().getRepository(Cart);
    const count = await cartRepository.count({ where: { user: userEmail }});

    ctx.status = 200;
    ctx.body = {
      name: 'SUCCESS',
      description: '장바구니 갯수 조회 성공',
      data: {
        count,
      },
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      name: 'SERVER_ERROR',
      description: '서버 에러'
    };
  }
};

export {
  getCarts,
  saveCart,
  removeCart,
  getCartCount,
};
