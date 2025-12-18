/**
 * NFT Gallery Component
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@vibethink/ui'

interface NFTGalleryProps {
  collections: any[]
  loading?: boolean
}

export const NFTGallery: React.FC<NFTGalleryProps> = ({ collections, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Collections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6 text-muted-foreground">
          <p>NFT collections and portfolio management</p>
        </div>
      </CardContent>
    </Card>
  )
}
