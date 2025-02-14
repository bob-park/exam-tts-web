import { HttpResponse, http } from 'msw';

const ASSET_SCRIPTS: AssetScript[] = [
  {
    id: 355,
    inPoint: 198502,
    outPoint: 199102,
    contents: '하나은행 23 박진영 자유투성공',
  },
  {
    id: 354,
    inPoint: 198099,
    outPoint: 198698,
    contents: '하나은행 23 박진영 자유투성공',
  },
  {
    id: 347,
    inPoint: 196361,
    outPoint: 196961,
    contents: '하나은행 77 박소희 자유투성공',
  },
  {
    id: 345,
    inPoint: 195628,
    outPoint: 196227,
    contents: '하나은행 77 박소희 페인트존2점슛성공',
  },
  {
    id: 326,
    inPoint: 193040,
    outPoint: 193639,
    contents: '하나은행 9 김시온 페인트존2점슛성공',
  },
  {
    id: 314,
    inPoint: 185602,
    outPoint: 186202,
    contents: '하나은행 11 양인영 자유투성공',
  },
  {
    id: 313,
    inPoint: 185003,
    outPoint: 185602,
    contents: '하나은행 11 양인영 자유투성공',
  },
  {
    id: 300,
    inPoint: 179148,
    outPoint: 179748,
    contents: '하나은행 13 김정은 페인트존2점슛성공',
  },
  {
    id: 297,
    inPoint: 177767,
    outPoint: 178366,
    contents: '하나은행 77 박소희 페인트존2점슛성공 속공성공',
  },
  {
    id: 293,
    inPoint: 176774,
    outPoint: 177374,
    contents: '하나은행 11 양인영 페인트존2점슛성공',
  },
];

const handlers = [
  http.get('/assets/scripts/tts', () => {
    return HttpResponse.json(ASSET_SCRIPTS, {
      headers: {
        'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
      },
    });
  }),
];

export default handlers;
