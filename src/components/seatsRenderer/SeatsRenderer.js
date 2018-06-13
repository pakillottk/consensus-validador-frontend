import React from 'react'
import { SeatsPositioner, SeatsPositionerCurve } from '../../2d/SeatsPositioner'
import { quadraticBezier } from '../../2d/utils'

export default class SeatsRenderer extends React.Component {
    renderSeats( color, polygon, rows ) {
        const seats = []
        const seatSizes = []
        const seatPositions = []
        const seatNumbers = []
        let seatCounter = 0
        rows.forEach(
            (row, index) => { 
                let points = []
                if( row.type === 'line' ) {
                    points = SeatsPositioner( polygon, row.rowOffset, row.rowDirection, row.orientation, 
                        row.seats, row.seatSize, row.seatSpacing, row.startMargin
                    )
                } else {
                    points = SeatsPositionerCurve(
                        polygon, 
                        { 
                            p0: { x: row.p0x, y: row.p0y }, 
                            p1: { x: row.p1x, y: row.p1y },
                            p2: { x: row.p2x, y: row.p2y } 
                        }, 
                        row.rowDirection,
                        row.startMargin,
                        row.seats, 
                        row.seatSize,
                        row.seatSpacing
                    )   
                }
                let seatInr 
                switch (row.numeration) {
                    case 'even':
                    case 'odd': {
                        seatInr = 2
                        break
                    }
                    default: {
                        seatInr = 1
                    }
                }

                let seatNumber
                for( let i = 0; i < points.length; i++ ) {
                    seatPositions.push( points[i] )
                    
                    seatNumber = row.firstSeat + (seatInr * i)
                    seatNumbers.push( seatNumber )
                    seatSizes.push( row.seatSize )

                    seats.push(
                        <a key={seatCounter++} style={{cursor:'pointer', position:'relative', zIndex:15}}>
                            <circle                                                     
                                cx={points[i].x} 
                                cy={points[i].y} 
                                r={row.seatSize} 
                                style={{fill:`rgba(${color.r},${color.g},${color.b},1.0)`}} 
                            />
                        </a>
                    )
                }
            }
        )

        return { rendered: seats, sizes: seatSizes, positions: seatPositions, numeration: seatNumbers }
    }

    renderSeatNumbers( seatData ) {
        const numbers = []

        let position, halfSeatSize
        for( let i = 0; i < seatData.positions.length; i++ ) {
            position = seatData.positions[ i ]
            halfSeatSize = seatData.sizes[ i ] * 0.5
            numbers.push(
                <div
                    key={i}
                    style={{
                        position:'absolute',
                        top: position.y - halfSeatSize,
                        left: position.x - halfSeatSize,
                        fontSize: (seatData.sizes[ i ]) + 'px',
                        color:'white',
                    }}
                >
                    {seatData.numeration[i]}
                </div>
            )
        }

        return numbers
    }

    renderCurves( rows ) {
        const curves = []
        rows.forEach(
            ( row, index ) => {
                if( row.type !== 'curve' ) {
                    return
                }

                const curve = { 
                    p0: { x: row.p0x, y: row.p0y }, 
                    p1: { x: row.p1x, y: row.p1y },
                    p2: { x: row.p2x, y: row.p2y } 
                }

                let points = ""
                const step = 1.0/256.0
                for( let i = 0; i <= 1.0; i += step) {
                    const curvePoint = quadraticBezier( curve.p0, curve.p1, curve.p2, i );
                    points += curvePoint.x + "," + curvePoint.y + " ";
                }

                curves.push(
                    <a key={index}>
                        <polyline points={points} style={{fill:'none', stroke:'rgba( 0, 0, 255, 0.75 )', strokeWidth:3}} />

                        <circle cx={curve.p0.x} cy={curve.p0.y} r={6} style={{fill:'rgba(0,70,0,0.5)'}} />
                        <circle cx={curve.p1.x} cy={curve.p1.y} r={6} style={{fill:'rgba(255,255,0,0.5)'}} />
                        <circle cx={curve.p2.x} cy={curve.p2.y} r={6} style={{fill:'rgba(255,0,0,0.5)'}} />
                    </a>
                )
            }
        )

        return curves
    }   


    renderLines( polygon, rows ) {
        const lines = []

        rows.forEach( 
            ( row, index ) => {
                if( row.type !== 'line' ) {
                    return
                }

                let inBoundX1, inBoundX2, inBoundY1, inBoundY2

                if( row.orientation === 'horizontal' ) {
                    inBoundY1 = inBoundY2 = polygon.bounds[1] + row.rowOffset + row.seatSize * 0.5
                    inBoundX1 = polygon.bounds[0]
                    while( !polygon.isInside({ x: inBoundX1, y: inBoundY1 }) ) {
                        if( inBoundX1 > polygon.bounds[2] ) {
                            break
                        }

                        inBoundX1 += 0.1
                    }

                    inBoundX2 = polygon.bounds[2]
                    while( !polygon.isInside({ x: inBoundX2, y: inBoundY2 }) ) {
                        if( inBoundX2 < polygon.bounds[0] ) {
                            break
                        }

                        inBoundX2 -= 0.1
                    }
                } else {
                    inBoundX1 = inBoundX2 = polygon.bounds[0]+ row.rowOffset + row.seatSize * 0.5
                    inBoundY1 = polygon.bounds[1]
                    while( !polygon.isInside({ x: inBoundX1, y: inBoundY1 }) ) {
                        if( inBoundY1 > polygon.bounds[3] ) {
                            break
                        }

                        inBoundY1 += 0.1
                    }

                    inBoundY2 = polygon.bounds[3]
                    while( !polygon.isInside({ x: inBoundX2, y: inBoundY2 }) ) {
                        if( inBoundY2 < polygon.bounds[1] ) {
                            break
                        }

                        inBoundY2 -= 0.1
                    }
                }  

                lines.push(
                    <line 
                        key={index} 
                        x1={ inBoundX1 } 
                        y1={ inBoundY1 }
                        x2={ inBoundX2 } 
                        y2={ inBoundY2 }
                        stroke="rgba(0,0,255,1.0)"
                        strokeWidth={2}
                    />
                )
            }
         )

        return lines
    }

    render() {
        const { rows, polygon, color, showCurves, showLines } = this.props
        if( !polygon || !rows ) {
            return null
        }
        const [ width, height ] = [ polygon.bounds[ 2 ], polygon.bounds[ 3 ] ]
        const seatData = this.renderSeats( color, polygon, rows );
        return(
            <div style={{width:'100%', height:'100%', pointerEvents:'none'}}>
                <svg width={ width } height={ height } style={{position:'relative'}}>
                    { seatData.rendered }                    
                    { showCurves && this.renderCurves( rows ) }
                    { showLines && this.renderLines( polygon, rows ) }
                </svg>
                { this.renderSeatNumbers( seatData ) }
            </div>
        )
    }
}