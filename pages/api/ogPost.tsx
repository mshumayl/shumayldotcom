import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

const font = fetch(new URL('../../assets/SpaceGrotesk-Light.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fontData = await font;

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : '';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgb(17 24 39)',
            height: '100%',
            width: '100%',
            padding: '60px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'right',
              color: 'rgb(17 24 39)',
              backgroundColor: 'white',
              fontSize: 40,
              paddingRight: '10px',
              paddingLeft: '10px',
              paddingTop: '5px',
              paddingBottom: '5px',
              alignItems: 'baseline',
              justifyContent: 'flex-end',
            }}
          >
            {"Shumayl.com"}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              fontSize: 70,
              fontFamily: 'Grotesk',
              color: 'white',
              marginTop: '20px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            {`> ${title}_`}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Grotesk',
            data: fontData,
            style: 'normal',
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
