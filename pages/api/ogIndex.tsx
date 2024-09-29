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

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'rgb(17 24 39)',
            height: '100%',
            width: '100%',
            padding: '60px',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              color: 'rgb(17 24 39)',
              backgroundColor: 'white',
              fontSize: 50,
              paddingRight: '10px',
              paddingLeft: '10px',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            {"shumayl.site >"}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              color: 'white',
              fontSize: 50,
              paddingRight: '10px',
              paddingLeft: '10px',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            {"Notes on software_"}
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
