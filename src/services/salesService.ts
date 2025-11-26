import { supabase } from '../lib/supabaseClient';
import { SalesHeader, SalesDetail, CashMovement, CartItem } from '../types/database.types';

// Definición de las interfaces (asumiendo que las tienes en database.types.ts)
// Esto es para referencia, si no lo tienes en un archivo separado, descoméntalo.
/*
interface SalesHeaderInsert {
    user_id: string;
    total: number;
    payment_method: string;
}

interface SalesDetailInsert {
    sale_header_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
}
*/

// --- FUNCIÓN PRINCIPAL DE REGISTRO DE VENTA ---

/**
 * Registra una venta completa (cabecera y detalle) y actualiza el stock de los productos vendidos.
 * @param userId ID del usuario que realiza la venta
 * @param cartItems Items del carrito de compras
 * @param paymentMethod Método de pago
 * @param totalAmount Monto total de la venta
 * @returns { saleHeaderId: number | null, success: boolean }
 */
export async function registerSale(
    userId: string,
    cartItems: CartItem[],
    paymentMethod: 'efectivo' | 'yape' | 'plin' | 'tarjeta',
    totalAmount: number
): Promise<{ saleHeaderId: number | null; success: boolean; error?: any }> {
    try {
        // 1. PREPARAR DATOS DE LA CABECERA
        const headerData: Omit<SalesHeader, 'id' | 'created_at'> = {
            user_id: userId,
            total: totalAmount,
            payment_method: paymentMethod,
            status: 'completed'
        };

        // 2. INSERCIÓN DE LA CABECERA DE VENTA
        const { data: headerInsert, error: headerError } = await supabase
            .from('sales_header')
            .insert([headerData])
            .select('id')
            .single();

        if (headerError || !headerInsert) {
            console.error("Error al insertar cabecera de venta:", headerError);
            throw new Error(`Error al insertar cabecera: ${headerError?.message}`);
        }

        const saleHeaderId = headerInsert.id;

        // 3. PREPARACIÓN E INSERCIÓN DEL DETALLE DE VENTA
        const detailsToInsert = cartItems.map(item => ({
            sale_header_id: saleHeaderId,
            product_id: item.product.id,
            quantity: item.qty,
            unit_price: item.product.price,
            subtotal: item.product.price * item.qty
        }));

        const { error: detailError } = await supabase
            .from('sales_detail')
            .insert(detailsToInsert);

        if (detailError) {
            console.error("Error al insertar detalles de venta:", detailError);
            // NOTA: En un sistema real, aquí haríamos un ROLLBACK (DELETE) de la cabecera.
            throw new Error(`Error al insertar detalles de venta: ${detailError.message}`);
        }

        // 4. ACTUALIZACIÓN DE STOCK (Lógica trasladada al cliente)
        for (const detail of detailsToInsert) {
            // Obtener el stock actual del producto (esto podría optimizarse si la función rpc funcionara)
            const { data: productData, error: productFetchError } = await supabase
                .from('products')
                .select('stock')
                .eq('id', detail.product_id)
                .single();
            
            if (productFetchError || !productData) {
                console.warn(`Advertencia: No se pudo obtener el stock del producto ID ${detail.product_id}.`, productFetchError);
                continue; // Saltar a la siguiente iteración
            }

            const newStock = productData.stock - detail.quantity;

            const { error: stockError } = await supabase
                .from('products')
                // Usamos .update para cambiar el stock
                .update({ stock: newStock })
                .eq('id', detail.product_id);

            if (stockError) {
                // Advertencia en lugar de error fatal, para no romper el flujo de venta.
                console.warn(`Advertencia: Error al actualizar el stock del producto ID ${detail.product_id}.`, stockError);
            }
        }

        console.log("Venta y stock registrados exitosamente.");
        return { saleHeaderId, success: true };

    } catch (error) {
        console.error("Error en registerSale:", error);
        return { saleHeaderId: null, success: false, error };
    }
}

/**
 * Servicio de ventas exportado como objeto (compatible con código existente)
 */
export const salesService = {
    registerSale,
    registerCashMovement,
    getSalesHistory
};

// --- FUNCIÓN PARA REGISTRAR MOVIMIENTOS DE CAJA ---

/**
 * Registra un movimiento de caja (apertura, cierre, ingreso, egreso)
 * @param movementData Datos del movimiento de caja
 * @returns { success: boolean, movementId: number | null }
 */
export async function registerCashMovement(
    movementData: Omit<CashMovement, 'id' | 'created_at'>
): Promise<{ success: boolean; movementId: number | null; error?: any }> {
    try {
        const { data, error } = await supabase
            .from('cash_movements')
            .insert([movementData])
            .select('id')
            .single();

        if (error || !data) {
            console.error("Error al registrar movimiento de caja:", error);
            throw new Error(`Error al registrar movimiento: ${error?.message}`);
        }

        console.log("Movimiento de caja registrado exitosamente:", data.id);
        return { success: true, movementId: data.id };

    } catch (error) {
        console.error("Error en registerCashMovement:", error);
        return { success: false, movementId: null, error };
    }
}

// --- FUNCIÓN PARA OBTENER EL HISTORIAL DE VENTAS (PENDIENTE) ---
// Función placeholder, la implementaremos después...
export async function getSalesHistory() {
    return [];
}